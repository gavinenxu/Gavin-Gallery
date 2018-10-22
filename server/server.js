const fs = require('fs')
const path = require('path')
const LRU = require('lru-cache')
const express = require('express')
// const favicon = require('serve-favicon')
const compression = require('compression')
const { createBundleRenderer } = require('vue-server-renderer')
const resolve = file => path.resolve(__dirname, file)

const isProd = process.env.NODE_ENV === 'production'

const serverInfo = 
  `express/${require('express/package.json').version}`

const app = express()

function createRenderer (serverBundle, options) {
  return createBundleRenderer(serverBundle, Object.assign(options, {
    cache: LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15
    }),
    basedir: resolve('../dist'),
    runInNewContext: false
  }))
}

let renderer
let readyPromise
const templatePath = resolve('../src/index.template.html')
if (isProd) {

} else {
  // renderer = createRenderer()
  // 执行promise, init webpack config
  readyPromise = require('../build/setup-dev-server')(
    app,
    templatePath,
    (serverBundle, options) => {
      renderer = createRenderer(serverBundle, options)
    }
  )
}

function render(req, res) {
  const s = Date.now()

  res.setHeader("Content-Type", "text/html")
  res.setHeader("Server", serverInfo)

  const handleError = err => {
    if (err.url) {
      // render error, so redirect to try again
      res.redirect(err.url)
    } else if (err.code === 404) {
      res.status(404).send('404 | Page Not Found')
    } else {
      res.status(500).send('500 | Internal Server Error')
      console.error(`error during render : ${req.url}`)
      console.error(err.stack)
    }
  }

  const context = {
    title: 'Gavinnn Gallery',
    url: req.url
  }

  // get cb from renderToString and render html
  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err)
    }
    res.send(html)
    if (!isProd) {
      console.log(`whole request: ${Date.now() -s}ms`)
    }
  })
}

app.get('*', isProd ? render : (req, res) => {
  readyPromise.then(() => { render(req, res) })
})

const port = process.env.PORT || 8090
app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})
