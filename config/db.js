import { Sequelize } from "sequelize"

let environment = (process.env.ENV) ? process.env.ENV : 'Dev'
let connection
if (environment == 'Dev') {
    connection = new Sequelize({
        dialect: 'sqlite',
        logging: false,
    })
} else {
    connection = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            host: process.env.DB_HOST,
            dialect: "postgres",
            logging: false
        }
    )
}
export const db = connection