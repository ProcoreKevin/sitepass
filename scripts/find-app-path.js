const fs = require("fs")
const path = require("path")

console.log("CWD:", process.cwd())
console.log("__dirname:", __dirname)
console.log("__filename:", __filename)

// Try to find the app directory
const candidates = [
  "/vercel/share/v0-project/app",
  path.join(process.cwd(), "app"),
  path.join(__dirname, "../app"),
  path.join(__dirname, "../../app"),
]

for (const c of candidates) {
  console.log(`${c} exists: ${fs.existsSync(c)}`)
}
