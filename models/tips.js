const mongoose = require('mongoose');
var access_levels = require('./system/access_levels.js');

  const TipSchema = mongoose.Schema(
  {
    tip_name:
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

  const Tip = module.exports = mongoose.model('tips', TipSchema);
  module.exports.ACCESS_MODE = access_levels.NORMAL;//Required access level to execute these methods

  module.exports.get = function(tip_id, callback)
  {
    var query = {_id: tip_id};
    Tip.findOne(query, callback);
  };

  module.exports.getAll = function(callback)
  {
    Tip.find({}, callback);
  }

  module.exports.add = function(tip, callback)
  {
    Tip.create(tip, callback);
  };

  module.exports.update = function(tip_id, tip, callback)
  {
    var query = {_id: tip_id};
    Tip.findOneAndUpdate(query, tip, {}, callback);
  };

  module.exports.remove = function(tip_id, callback)
  {
    var query = {_id: tip_id};
    Tip.remove(query, callback);
  };

  module.exports.isValid = function(tip)
  {
    if(isNullOrEmpty(tip))
      return false;
    //attribute validation
    if(isNullOrEmpty(tip.tip_name))
      return false;
    if(isNullOrEmpty(tip.price))
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
