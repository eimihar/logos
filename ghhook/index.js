require("dotenv").config()
const { exec } = require("child_process")
const fs = require("fs")
const path = require("path")

const DEPLOY_SCRIPT = path.join(__dirname, "..", "deploy.sh")
const DEPLOY_LOG = path.join(__dirname, "..", "deploy.log")

const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString()
    },
  }),
)

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "GitHub webhook server is running" })
})

app.post("/webhook", (req, res) => {
  const event = req.headers["x-github-event"]

  if (event === "push") {
    const timestamp = new Date().toISOString()
    fs.writeFileSync(DEPLOY_LOG, `[${timestamp}] Running deploy...`)

    exec(`cd .. && sh ${DEPLOY_SCRIPT}`, (error) => {
      const status = error ? "failed" : "success"
      const logEntry = `[${new Date().toISOString()}] ${status}\n`
      fs.writeFileSync(DEPLOY_LOG, logEntry, { flag: "a" })
    })
  }

  res.json({ status: "received", event })
})

app.listen(PORT)
