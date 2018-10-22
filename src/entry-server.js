import { createApp } from './app'

const isDev = process.env.NODE_ENV !== 'production'

export default context => {
  return new Promise((resolve, reject) => {
    const start = isDev && Date.now()
    const { app } = createApp()

    const { url } = context

    resolve(app)

  })
}