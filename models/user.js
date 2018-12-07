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

  // User.authenticate = function(username, password, done) {
  //   this.findOne({where:{ email: username }}).then(function(result){
  //     if (!result) { return done(null, false); }
  //    // if (!user.verifyPassword(password)) { return done(null, false); }
  //     return done(null, result);
  //   });

  // };

  // User.serializeUser = function(user, done) {
  //   done(null, user.id);
  // };
  
  // User.deserializeUser = function(id, done) {
   
  //   this.findOne({where:{id:id}}).then(function(result){
  //       done(null, result);
  //   })
  //   .catch(function(err){
  //       done(err, null);
  //   });
    
  // };


  return User;
};
