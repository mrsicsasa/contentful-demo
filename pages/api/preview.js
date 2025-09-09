export default async function handler(req, res) {
  res.setPreviewData({}) // uključuje preview mode u Next.js
  res.writeHead(307, { Location: '/' }) // redirektuje na home
  res.end()
}
