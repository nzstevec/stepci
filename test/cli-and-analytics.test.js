const assert = require('assert')
const fs = require('fs')
const os = require('os')
const path = require('path')
const http = require('http')
const { spawn } = require('child_process')
const { sendAnalyticsEvent } = require('../dist/lib/analytics')

function runCli(args, env = {}) {
  return new Promise((resolve) => {
    const child = spawn('node', ['dist/index.js', ...args], {
      cwd: path.join(__dirname, '..'),
      env: {
        ...process.env,
        ...env,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString()
    })

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString()
    })

    child.on('close', (code) => {
      resolve({ code, stdout, stderr })
    })
  })
}

function withTempWorkflow(yaml, run) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'stepci-cli-test-'))
  const filePath = path.join(dir, 'workflow.yml')
  fs.writeFileSync(filePath, yaml)
  return Promise.resolve()
    .then(() => run(filePath))
    .finally(() => {
      fs.rmSync(dir, { recursive: true, force: true })
    })
}

function withServer(handler, run) {
  const server = http.createServer(handler)
  return new Promise((resolve, reject) => {
    server.listen(0, '127.0.0.1', async () => {
      try {
        const address = server.address()
        await run(address.port)
        server.close(() => resolve())
      } catch (err) {
        server.close(() => reject(err))
      }
    })
  })
}

async function testAnalyticsDisabledByDefault() {
  const captured = []
  const previous = process.env.STEPCI_ENABLE_ANALYTICS
  delete process.env.STEPCI_ENABLE_ANALYTICS

  try {
    sendAnalyticsEvent({ capture: (event) => captured.push(event) })
  } finally {
    if (previous === undefined) {
      delete process.env.STEPCI_ENABLE_ANALYTICS
    } else {
      process.env.STEPCI_ENABLE_ANALYTICS = previous
    }
  }

  assert.strictEqual(captured.length, 0, 'analytics capture should not run by default')
}

async function testAnalyticsEnabledSendsEvent() {
  const captured = []
  const previous = process.env.STEPCI_ENABLE_ANALYTICS
  process.env.STEPCI_ENABLE_ANALYTICS = '1'

  try {
    sendAnalyticsEvent({ capture: (event) => captured.push(event) })
  } finally {
    if (previous === undefined) {
      delete process.env.STEPCI_ENABLE_ANALYTICS
    } else {
      process.env.STEPCI_ENABLE_ANALYTICS = previous
    }
  }

  assert.strictEqual(captured.length, 1, 'analytics capture should run when opt-in is set')
  assert.strictEqual(captured[0].event, 'ping')
}

async function testRunWithTestFilter() {
  const yaml = `version: "1.1"
name: Filter

tests:
  alpha:
    steps:
      - name: alpha-step
        delay: 1ms
  beta:
    steps:
      - name: beta-step
        delay: 1ms
`

  await withTempWorkflow(yaml, async (workflowPath) => {
    const result = await runCli(['run', workflowPath, '--test', 'beta', '--verbose'])
    assert.strictEqual(result.code, 0)
    assert.ok(result.stdout.includes('PASS  beta'), 'targeted test should run')
    assert.ok(!result.stdout.includes('PASS  alpha'), 'non-targeted test should not run')
  })
}

async function testRunWithoutTestFilterRunsAll() {
  const yaml = `version: "1.1"
name: Filter Omitted

tests:
  alpha:
    steps:
      - name: alpha-step
        delay: 1ms
  beta:
    steps:
      - name: beta-step
        delay: 1ms
`

  await withTempWorkflow(yaml, async (workflowPath) => {
    const result = await runCli(['run', workflowPath, '--verbose'])
    assert.strictEqual(result.code, 0)
    assert.ok(result.stdout.includes('PASS  alpha'), 'alpha test should run when filter is omitted')
    assert.ok(result.stdout.includes('PASS  beta'), 'beta test should run when filter is omitted')
  })
}

async function testRunWithMissingTestFails() {
  const yaml = `version: "1.1"
name: Missing

tests:
  alpha:
    steps:
      - name: alpha-step
        delay: 1ms
`

  await withTempWorkflow(yaml, async (workflowPath) => {
    const result = await runCli(['run', workflowPath, '--test', 'unknown'])
    assert.strictEqual(result.code, 5)
    assert.ok(result.stderr.includes("Test 'unknown' was not found"))
  })
}

async function testStepLogOutputWithTemplate() {
  await withServer((req, res) => {
    if (req.url === '/ok' && req.method === 'GET') {
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ ok: true }))
      return
    }
    res.writeHead(404, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ error: 'not found' }))
  }, async (port) => {
    const yaml = `version: "1.1"
name: Log
env:
  user: ada

tests:
  example:
    steps:
      - name: logged request
        log: starting request for \${{env.user}}
        http:
          url: http://127.0.0.1:${port}/ok
          method: GET
          check:
            status: 200
`

    await withTempWorkflow(yaml, async (workflowPath) => {
      const result = await runCli(['run', workflowPath, '--verbose'])
      assert.strictEqual(result.code, 0)
      assert.ok(result.stdout.includes('starting request for ada'), 'log output should be rendered with templates')
      const logPos = result.stdout.indexOf('starting request for ada')
      const requestPos = result.stdout.indexOf('GET http://127.0.0.1')
      assert.ok(logPos >= 0 && requestPos >= 0 && logPos < requestPos, 'log should print before request details')
    })
  })
}

async function run() {
  await testAnalyticsDisabledByDefault()
  await testAnalyticsEnabledSendsEvent()
  await testRunWithTestFilter()
  await testRunWithoutTestFilterRunsAll()
  await testRunWithMissingTestFails()
  await testStepLogOutputWithTemplate()
  console.log('cli-and-analytics tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
