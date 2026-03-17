require("dotenv").config()
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
  const signature = req.headers["x-hub-signature-256"]
  const event = req.headers["x-github-event"]

  console.log(`Received event: ${event}`)
  console.log("Payload:", JSON.stringify(req.body, null, 2))

  if (event === "push") {
    const { ref, commits, pusher, repository } = req.body

    console.log(`Push to ${ref} by ${pusher?.name || "unknown"}`)
    console.log(`Repository: ${repository?.full_name || "unknown"}`)

    if (commits && commits.length > 0) {
      console.log(`Commits (${commits.length}):`)
      commits.forEach((commit) => {
        console.log(`  - ${commit.message} (${commit.id.substring(0, 7)})`)
      })
    }
  }

  res.json({ status: "received", event })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
