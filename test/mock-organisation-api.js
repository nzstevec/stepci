const http = require('http')
const { URL } = require('url')

const port = Number(process.env.PORT || 3001)

let organisations = [
  {
    id: 1,
    name: 'Step CI Ltd',
    shortName: 'STEP',
    emailAddress: 'hello@step.ci'
  }
]

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(payload))
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''

    req.on('data', (chunk) => {
      data += chunk

      if (data.length > 1024 * 1024) {
        reject(new Error('Body too large'))
        req.destroy()
      }
    })

    req.on('end', () => {
      if (!data) {
        return reject(new Error('Request body is required'))
      }

      try {
        resolve(JSON.parse(data))
      } catch {
        reject(new Error('Invalid JSON body'))
      }
    })

    req.on('error', reject)
  })
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

const server = http.createServer(async (req, res) => {
  if (!req.url || !req.method) {
    return sendJson(res, 400, { error: 'Malformed request' })
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
  const { pathname } = url

  if (req.method === 'GET') {
    const match = pathname.match(/^\/organisation\/(\d+)$/)

    if (match) {
      const id = Number(match[1])
      const organisation = organisations.find((item) => item.id === id)

      if (!organisation) {
        return sendJson(res, 404, { error: 'Organisation not found' })
      }

      return sendJson(res, 200, organisation)
    }
  }

  if (req.method === 'POST' && pathname === '/organisation') {
    try {
      const body = await readJsonBody(req)
      const { name, shortName, emailAddress } = body

      if (!isNonEmptyString(name) || !isNonEmptyString(shortName) || !isNonEmptyString(emailAddress)) {
        return sendJson(res, 400, {
          error: 'name, shortName and emailAddress are required string properties'
        })
      }

      const nextId = organisations.reduce((max, item) => Math.max(max, item.id), 0) + 1
      const organisation = {
        id: nextId,
        name: name.trim(),
        shortName: shortName.trim(),
        emailAddress: emailAddress.trim()
      }

      organisations.push(organisation)
      return sendJson(res, 201, organisation)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to parse request body'
      return sendJson(res, 400, { error: message })
    }
  }

  return sendJson(res, 404, { error: 'Not found' })
})

server.listen(port, () => {
  console.log(`Mock organisation API listening on http://localhost:${port}`)
})
