'use strict';

module.exports = (sequelize, DataTypes) => {

  var User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  }, 
  
  {
    tableName:'users',
    timestamps: true,
   // createdAt: 'created_at',
   // updatedAt: 'updated_at',
  });


  return User;
};
