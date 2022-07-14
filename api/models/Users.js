import { Sequelize, DataTypes } from "sequelize"
import { db } from "../../config/db.js"

const User = db.define('access', {
  uuid: { primaryKey: true, type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  lastname: { type: DataTypes.STRING },
  birthday: { type: DataTypes.DATE },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  salt: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  nip: { type: DataTypes.STRING, allowNull: false },
  active: { type: DataTypes.BOOLEAN, defaultValue: false },
  verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  verifiedtoken: { type: DataTypes.STRING },
  createdAt: { type: 'TIMESTAMP WITHOUT TIME ZONE' },
  updatedAt: { type: 'TIMESTAMP WITHOUT TIME ZONE' },
}, {
  freezeTableName: true,
})

export default User