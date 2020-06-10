import express from 'express'
import Server from "../src/server/app.js";
import path from 'path';
import request from 'request-promise-native'
import fs from 'fs';

const server = new Server()

const router = express.Router()

router.get('/upload', async (req, res) => {
  res.sendFile(path.resolve() + "/test/upload.htm")
})

server.addTestRouter(router)

const PORT = process.env.PORT || 5000

const testPath = async () => {
  const uri = `http://localhost:${PORT}/api/files/output/all`
  console.log(`Calling ${uri}`)
  const data = {
    method: 'GET',
    uri: uri,
    json: true
  }
  try {
    const response = await request(data)
    console.log(`Result: ${JSON.stringify(response)}`)
  } catch (e) {
    console.log(e)
  }
}

const testDownload = async () => {
  const uri = `http://localhost:${PORT}/api/files/output/image-1591741745231.png`
  console.log(`Calling ${uri}`)
  const data = {
    method: 'GET',
    uri: uri,
    encoding: 'binary'
  }
  try {
    const response = await request(data)
    fs.mkdirSync('test/download', { recursive: true })
    fs.writeFile('test/download/image.png', response, 'binary', function (err) {
      if (err) {
        console.log(err);
        return
      }
      console.log('File saved.')
    })
  } catch (e) {
    console.log(e)
  }
}

server.setOnReady(async (port) => {
  console.log(`listening on port: ${port}`)
  testPath()
  testDownload()
})

server.start(PORT)