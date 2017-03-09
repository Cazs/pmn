const mongoose = require('mongoose');
var access_levels = require('./system/access_levels.js');

  const ServiceSchema = mongoose.Schema(
  {
    service_name:
    {
      type:String,
      required:true
    },
    price:
    {
      type:Number,
      required:true
    },
    other:
    {
      type:String,
      required:false
    }
  });

  const Service = module.exports = mongoose.model('services', ServiceSchema);
  module.exports.ACCESS_MODE = access_levels.NORMAL;//Required access level to execute these methods

  module.exports.get = function(service_id, callback)
  {
    var query = {_id: service_id};
    Service.findOne(query, callback);
  };

  module.exports.getAll = function(callback)
  {
    Service.find({}, callback);
  }

  module.exports.add = function(service, callback)
  {
    Service.create(service, callback);
  };

  module.exports.update = function(service_id, service, callback)
  {
    var query = {_id: service_id};
    Service.findOneAndUpdate(query, service, {}, callback);
  };

  module.exports.remove = function(service_id, callback)
  {
    var query = {_id: service_id};
    Service.remove(query, callback);
  };

  module.exports.isValid = function(service)
  {
    if(isNullOrEmpty(service))
      return false;
    //attribute validation
    if(isNullOrEmpty(service.service_name))
      return false;
    if(isNullOrEmpty(service.price))
      return false;

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
