import { DataTypes } from "sequelize"
import { db } from "../../config/db.js"

export const Apps = db.define('accounts_apps', {
    uuid: { primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER },
    user: { type: DataTypes.UUID },
    app: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: 'TIMESTAMP WITHOUT TIME ZONE' },
    updatedAt: { type: 'TIMESTAMP WITHOUT TIME ZONE' },
}, {
    freezeTableName: true,
})

// export default Apps