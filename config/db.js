import { Sequelize } from "sequelize"

export const db = new Sequelize(
    "apps",
    "docker",
    "docker",
    {
        host: "localhost",
        dialect: "postgres",
        logging: false
    }
)