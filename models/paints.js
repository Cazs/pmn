const mongoose = require('mongoose');
var access_levels = require('./system/access_levels.js');

  const PaintSchema = mongoose.Schema(
  {
    paint_name:
    {
      type:String,
      required:true
    },
    colour_value:
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

  const Paint = module.exports = mongoose.model('paints', PaintSchema);
  module.exports.ACCESS_MODE = access_levels.NORMAL;//Required access level to execute these methods

  module.exports.get = function(booking_id, callback)
  {
    var query = {_id: booking_id};
    Paint.findOne(query, callback);
  };

  module.exports.getAll = function(callback)
  {
    Paint.find({}, callback);
  }

  module.exports.add = function(paint, callback)
  {
    Paint.create(paint, callback);
  };

  module.exports.update = function(paint_id, paint, options, callback)
  {
    var query = {_id: paint_id};
    Paint.findOneAndUpdate(query, paint, options, callback);
  };

  module.exports.remove = function(paint_id, callback)
  {
    var query = {_id: paint_id};
    Paint.remove(query, callback);
  };

  module.exports.isValid = function(paint)
  {
    if(isNullOrEmpty(paint))
      return false;
    //attribute validation
    if(isNullOrEmpty(paint.paint_name))
      return false;
    if(isNullOrEmpty(paint.colour_value))
      return false;
    if(isNullOrEmpty(paint.price))
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
