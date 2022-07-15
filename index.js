import app from "./api/controllers/users.js"
import { db } from "./config/db.js"

async function main() {
    await db.sync({ force: true })
    app.listen(3000)
    console.log('🚀 ignition...')
}
main()