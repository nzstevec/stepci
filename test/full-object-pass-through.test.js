const assert = require('assert')
const { spawn } = require('child_process')
const path = require('path')
const { runFromYAML } = require('@steve.clogic/runner')

function startMockApi() {
  return new Promise((resolve, reject) => {
    const serverProcess = spawn('node', [path.join(__dirname, 'mock-organisation-api.js')], {
      stdio: ['ignore', 'pipe', 'pipe']
    })

    const onData = (chunk) => {
      const text = chunk.toString()
      if (text.includes('Mock organisation API listening on')) {
        serverProcess.stdout.off('data', onData)
        resolve(serverProcess)
      }
    }

    serverProcess.stdout.on('data', onData)
    serverProcess.stderr.on('data', (chunk) => {
      const text = chunk.toString()
      if (text.trim()) {
        reject(new Error(`Failed to start mock API: ${text}`))
      }
    })

    serverProcess.on('exit', (code) => {
      reject(new Error(`Mock API exited early with code ${code}`))
    })
  })
}

function stopMockApi(serverProcess) {
  return new Promise((resolve) => {
    if (serverProcess.killed) {
      resolve()
      return
    }

    serverProcess.once('exit', () => resolve())
    serverProcess.kill('SIGTERM')
  })
}

async function run() {
  const serverProcess = await startMockApi()

  try {
    const passThroughWorkflow = `version: "1.1"
name: Full Object Pass Through Validation
env:
  host: localhost:3001
tests:
  object-pass-through:
    steps:
      - name: create
        http:
          url: http://\${{env.host}}/organisation
          method: POST
          headers:
            Content-Type: application/json
          json:
            name: Example Organisation
            shortName: EXORG
            emailAddress: contact@example.org
          captures:
            organisationId:
              jsonpath: $.id
      - name: fetch and mutate capture
        http:
          url: http://\${{env.host}}/organisation/\${{captures.organisationId}}
          method: GET
          captures:
            thebody:
              jsonpath: $
              update:
                shortName: EXORG-UPDATED
      - name: create from full object
        http:
          url: http://\${{env.host}}/organisation
          method: POST
          headers:
            Content-Type: application/json
          json: \${{captures.thebody}}
  scalar-and-mixed:
    steps:
      - name: create scalar source
        http:
          url: http://\${{env.host}}/organisation
          method: POST
          headers:
            Content-Type: application/json
          json:
            name: Scalar Example
            shortName: SCALAR
            emailAddress: scalar@example.org
          captures:
            organisationId:
              jsonpath: $.id
      - name: scalar and mixed template json
        http:
          url: http://\${{env.host}}/organisation
          method: POST
          headers:
            Content-Type: application/json
            X-Trace: trace-\${{captures.organisationId}}
          json:
            name: Scalar Example
            shortName: scalar-\${{captures.organisationId}}
            emailAddress: scalar@example.org
            idEcho: \${{captures.organisationId}}
`

    const passResult = await runFromYAML(passThroughWorkflow)

    const objectStep = passResult.result.tests[0].steps[2]
    assert.strictEqual(objectStep.passed, true, 'full-object pass-through step should pass')
    const objectPayload = JSON.parse(objectStep.request.body)
    assert.strictEqual(objectPayload.shortName, 'EXORG-UPDATED', 'mutated shortName should be passed through')

    const scalarStep = passResult.result.tests[1].steps[1]
    assert.strictEqual(scalarStep.passed, true, 'scalar/mixed json step should pass')
    const scalarPayload = JSON.parse(scalarStep.request.body)
    assert.strictEqual(typeof scalarPayload.idEcho, 'number', 'full-expression scalar should preserve numeric type')
    assert.strictEqual(typeof scalarPayload.shortName, 'string', 'mixed template should remain string')
    assert.ok(scalarPayload.shortName.startsWith('scalar-'), 'mixed template should interpolate into string')

    const errorWorkflow = `version: "1.1"
name: Invalid Full Expression
env:
  host: localhost:3001
tests:
  invalid-json-template:
    steps:
      - name: invalid
        http:
          url: http://\${{env.host}}/organisation
          method: POST
          headers:
            Content-Type: application/json
          json:
            name: Example Organisation
            shortName: \${{captures.missingValue}}
            emailAddress: contact@example.org
`

    const errorResult = await runFromYAML(errorWorkflow)
    const invalidStep = errorResult.result.tests[0].steps[0]
    assert.strictEqual(invalidStep.errored, true, 'invalid full expression should error')
    assert.ok(invalidStep.errorMessage.includes('resolved to undefined'), 'error should explain undefined template resolution')

    console.log('full-object-pass-through tests passed')
  } finally {
    await stopMockApi(serverProcess)
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
