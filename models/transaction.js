'use strict';

module.exports = (sequelize, DataTypes) => {

  var Transaction = sequelize.define('Transaction', {
    title: DataTypes.STRING,
    amount:DataTypes.FLOAT,
    currency:DataTypes.INTEGER,
    type: DataTypes.INTEGER,
    date:DataTypes.DATE,
    attachment:DataTypes.STRING
  }, 
  
  {
    tableName:'transactions',
    timestamps: true,
   // createdAt: 'created_at',
   // updatedAt: 'updated_at',
  });


  return Transaction;

};
