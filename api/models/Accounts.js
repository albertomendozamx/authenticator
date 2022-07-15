import { Sequelize, DataTypes } from "sequelize"
import { db } from "../../config/db.js"
import { Apps } from "./Accounts_apps.js"

export const Accounts = db.define('accounts', {
  uuid: { primaryKey: true, type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, unique: true },
  name: { type: DataTypes.STRING, allowNull: false, uniquer: true },
  lastname: { type: DataTypes.STRING },
  birthday: { type: DataTypes.DATE },
  email: { type: DataTypes.TEXT, allowNull: false, unique: true },
  phone: { type: DataTypes.TEXT, allowNull: false, unique: true },
  salt: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.TEXT, allowNull: false },
  nip: { type: DataTypes.TEXT, allowNull: false },
  active: { type: DataTypes.BOOLEAN, defaultValue: false },
  verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  verifiedtoken: { type: DataTypes.STRING },
  createdAt: { type: 'TIMESTAMP WITHOUT TIME ZONE' },
  updatedAt: { type: 'TIMESTAMP WITHOUT TIME ZONE' },
}, {
  freezeTableName: true,
})

Accounts.hasMany(Apps, {
  foreignKey: 'user',
  sourceKey: 'uuid'
})
Apps.belongsTo(Accounts, { foreignKey: 'user', targetId: 'uuid' })