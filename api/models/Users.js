import { Sequelize, Model, DataTypes } from "sequelize"
import utcToZonedTime from 'date-fns-tz'
import format from 'date-fns'

const sequelize = new Sequelize('postgres://docker:docker@localhost:5432/apps')

const User = sequelize.define('access', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  uuid: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING },
  lastname: { type: DataTypes.STRING },
  birthday: { type: DataTypes.DATE },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  salt: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
  nip: { type: DataTypes.STRING },
  active: DataTypes.BOOLEAN,
  verified: DataTypes.BOOLEAN,
  verifiedtoken: { type: DataTypes.STRING },
  createdAt: {
    type: 'TIMESTAMP WITHOUT TIME ZONE',
    get() { return format(utcToZonedTime(this.getDataValue('createdAt'), 'America/Mexico_city'), 'dd.MM.yyyy HH:mm') }
  },
  updtedAt: { type: DataTypes.DATE },

}, {
  freezeTableName: true,
})

await sequelize.sync({ alter: true })
export default User