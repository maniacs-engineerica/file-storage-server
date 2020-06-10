import Server from './server/app.js'

const server = new Server()

const PORT = process.env.PORT

server.setOnReady(async (port) => {
    console.log(`listening on port: ${port}`)
})

server.start(PORT)
