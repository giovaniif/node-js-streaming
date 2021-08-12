import express from 'express'
import path from 'path'
import fs from 'fs'

const app = express()

app.get('/', (req, res) => {
  res.sendFile(path.resolve('.', 'index.html'))
})

app.get('/video', (req, res) => {
  const range = req.headers.range
  if (!range) res.status(400).send('Required range header')

  const videoPath = path.resolve('.', 'bigbuck.mp4')
  const videoSize = fs.statSync(videoPath).size

  const chunkSize = 10 ** 6
  const start = Number(range.replace(/\D/g, ""))
  const end = Math.min(start + chunkSize, videoSize - 1)

  const contentLength = end - start + 1
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  }

  res.writeHead(206, headers)

  const videoStream = fs.createReadStream(videoPath, { start, end })
  videoStream.pipe(res)
})

app.listen(3000, () => console.log('Netflix'))
