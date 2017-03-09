var mongoose = require('mongoose');
const crypto = require('crypto');
var access_levels = require('./system/access_levels.js');

module.exports.VALIDATION_MODE_STRICT = "strict";
module.exports.VALIDATION_MODE_PASSIVE = "passive";

var userSchema = mongoose.Schema(
  {
    usr:{
      type:String,
      required:true
    },
    pwd:{
      type:String,
      required:true
    },
    access_level:{
      type: Number,
      required: false,
      default: 0
    },
    firstname:{
      type:String,
      required:false
    },
    lastname:{
      type:String,
      required:false
    },
    gender:{
      type:String,
      required:false
    },
    email:{
      type:String,
      required:true
    },
    tel:{
      type:String,
      required:false
    },
    cell:{
      type:String,
      required:false
    },
    active:{
      type:Boolean,
      required:false
    },
    other:{
      type:String,
      required:false
    }
  }
);

var User = module.exports = mongoose.model('users',userSchema);
module.exports.ACCESS_MODE = access_levels.NORMAL;//Required access level to execute these methods
module.exports.VALIDATION_MODE = this.VALIDATION_MODE_STRICT;//Required validation mode to execute these methods

//Get Users
module.exports.getAll = function(callback)
{
  User.find({}, callback);
}

module.exports.add = function(user, callback)
{
  //Check if user being created is not greater than a normal user
  if(user.access_level)
  {
    if(user.access_level>access_levels.NORMAL)
    {
      console.log('User "%s[%s]", tried to create an account with elevated privilleges.', user, id);
      return;
    }
  }
  user.pwd = crypto.createHash('sha1').update(user.pwd).digest('hex');
  User.create(user, callback);
}

module.exports.update = function(id, user, callback)
{
  //Check if user being created is not greater than a normal user
  if(user.access_level)
  {
    if(user.access_level>access_levels.NORMAL)
    {
      console.log('User "%s[%s]", tried to upgrade his/her account to elevated privilleges.', user, id);
      return;
    }
  }
  var query = {_id: id};
  //var update = { usr: user.username};
  var sha = crypto.createHash('sha1');
  user.pwd = sha.update(user.pwd).digest('hex');
  User.findOneAndUpdate(query, user, {}, callback);
}

module.exports.remove = function(id, callback)
{
  var query = {_id: id};
  User.remove(query, callback);
}

module.exports.get = function(usr, callback)
{
  var query = {usr: usr};
  User.findOne(query, callback);
}

module.exports.validate = function(usr, pwd, callback)
{
  var pass = crypto.createHash('sha1').update(pwd).digest('hex');
  var query = {usr: usr, pwd: pass};
  return User.findOne(query, callback);
}

module.exports.isValid = function(user)
{
  if(isNullOrEmpty(user))
    return false;
  //attribute validation
  if(this.VALIDATION_MODE == this.VALIDATION_MODE_STRICT)
  {
    if(isNullOrEmpty(user.usr))
      return false;
    if(isNullOrEmpty(user.pwd))
      return false;
  }

  if(isNullOrEmpty(user.email))
    return false;
  /*if(isNullOrEmpty(user.gender))
    return false;
  if(isNullOrEmpty(user.firstname))
    return false;
  if(isNullOrEmpty(user.lastname))
    return false;
  if(isNullOrEmpty(user.tel))
    return false;
  if(isNullOrEmpty(user.cell))
    return false;
  if(isNullOrEmpty(user.active))
    return false;*/

    return true;
}

isNullOrEmpty = function(obj)
{
  if(obj==null)
  {
    return true;
  }
  if(obj.length<=0)
  {
    return true;
  }
  return false;
}
