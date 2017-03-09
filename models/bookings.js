const mongoose = require('mongoose');
var access_levels = require('./system/access_levels.js');

const BookingSchema = mongoose.Schema(
  {
    client_username:
    {
      type:String,
      required:true
    },
    date:
    {
      type:Number,
      required:true
    },
    location:{
      type:String,
      required:true
    },
    nails:
    {
      type:String,
      required:true
    },
    packages:
    {
      type:String,
      required:false
    },
    waxes:
    {
      type:String,
      required:false
    },
    extras:
    {
      type:String,
      required:false
    }
  });

  const Booking = module.exports = mongoose.model('bookings', BookingSchema);
  module.exports.ACCESS_MODE = access_levels.NORMAL;//Required access level to execute these methods

  module.exports.get = function(booking_user, callback)
  {
    var query = {client_username: booking_user};
    Booking.find(query,callback);
  };

  module.exports.getAll = function(callback)
  {
    Booking.find({}, callback);
  }

  module.exports.add = function(booking, callback)
  {
    //parse booking object - nails to be specific
    var nails = "";
    booking.nails.forEach(function(nail)
    {
        nails += 'nail_id=' + nail.nail_id + ';'
                  + 'service_id=' + nail.service_id + ';'
                  + 'service_name=' + nail.service_name + ';'
                  + 'colour=' + nail.colour + ';'
                  + 'tip=' + nail.tip.tip_id + ';'
                  + 'tip_style_name=' + nail.tip.tip_style_name + ';'
                  + 'tip_colour=' + nail.tip.colour
                  + '&';
    });
    booking.nails = nails;
    Booking.create(booking, function(err, booking)
    {
        if(booking && !err)
        {
          console.log('created booking, sending email.');

          var users = require('./users.js');
          //find the sender info on db
          var user = users.get(booking.client_username, function(err, user)
          {
            var mailjet = require('node-mailjet').connect('f8d3d1d74c95250bb2119063b3697082',
                                                              '8304b30da4245632c878bf48f1d65d92');

            var message = 'Hi ' + (user.firstname?(user.firstname + ' ' +user.lastname):user.usr) + ',<br/>'
                            + 'This email is to confirm our receival of your booking, below is the booking information.<br/>'
                            + "<br/><h3>Booking data</h3><br/><p>"+booking+"</p>";
            var request = mailjet.post("send").request(
            {
                "FromName":"Patricia",
                "FromEmail":"patricia@patrishnails.co.za",
                "Subject":"Booking ID: " + booking._id,
                "Text-part":booking,
                "Html-part":message,
                "Recipients":[
                        {
                                "Email": user.email
                        }
                ]
            }, function(err, res)
            {
              if(err)
                console.log('error: %s', err);
              else{
                console.log('email sent');
                callback(err);
              }
            });
          });

          /*var email = require('./system/email.js');
          email.send("patricia@patrishnails.co.za",
                  "Patricia",
                  "201458657@student.uj.ac.za",
                  "Test Mail #9",
                  "New booking",
                  "<h3>New booking: " + booking +"</h3>",function(err, res)
                  {
                    console.log(err||res);
                  }
                  /*function(response, body)
                  {
                    if(response)
                      console.log ('Response: %s', response);
                    if(body)
                      console.log ('Body: %s', body.response.res.statusCode);
                  }*);*/
        }else console.log(booking + ' ; and error=' + err);
    });
  };

  module.exports.update = function(booking_id, booking, callback)
  {
    var query = {_id: booking_id};
    Booking.findOneAndUpdate(query, booking, {}, callback);
  };

  module.exports.remove = function(booking_id, callback)
  {
    var query = {_id: booking_id};
    Booking.remove(query, callback)
  };

  module.exports.isValid = function(booking)
  {
    if(isNullOrEmpty(booking))
      return false;
    //attribute validation
    if(isNullOrEmpty(booking.client_username))
      return false;
    if(isNullOrEmpty(booking.date))
      return false;
    if(isNullOrEmpty(booking.nails))
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
