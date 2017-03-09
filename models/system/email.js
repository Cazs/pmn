module.exports.send = function(from, fromName, subject, recipient, text, html, callback)
{
  var mailjet = require('node-mailjet').connect('f8d3d1d74c95250bb2119063b3697082',
                                                    '8304b30da4245632c878bf48f1d65d92');

  var request = mailjet.post("send").request(
                {
                  "FromName":fromName,
                    "FromEmail":from,
                    "Subject":subject,
                    "Text-part":text,
                    "Html-part":html,
                    "Recipients":[
                            {
                                    "Email": recipient
                            }
                    ]
                }, callback);
                console.log('email sent');
};
