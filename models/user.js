const { ROLE, GENDER } = require('../utils/enum')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    aadharId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    country: {
      type: DataTypes.STRING,
    },
    phoneNo: {
      type: DataTypes.STRING,
    },
    countryCode: {
      type: DataTypes.STRING,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
      validate: {
        isIn: [ROLE],
      },
      allowNull: false,
    },
    age: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
      validate: {
        isIn: [GENDER],
      },
    },
  }, {
    indexes: [
      {
        fields: ['email'],
      },
    ],
    defaultScope: {
      attributes: {
        exclude: [
          'password',
        ],
      },
    },
  })
  User.associate = function (models) {
  }
  return User
}
