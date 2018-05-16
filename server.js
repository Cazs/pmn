//System modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//My modules
const sessions = require('./models/system/sessions.js');
const errors = require('./models/system/error_msgs.js');
const access_levels = require('./models/system/access_levels.js');
const users = require('./models/users.js');
const bookings = require('./models/bookings.js');
const paints = require('./models/paints.js');
const tips = require('./models/tips.js');
const services = require('./models/services.js');
const constants = require('./models/constants.js');

//defaults
app.use(express.static(__dirname+"/front-end"));

//init middle-ware
app.use(bodyParser.urlencoded({extended:true}));
//app.use(bodyParser.json());

//Connect to mongoose
mongoose.connect('mongodb://gh0st:#Reventone42@ds225010.mlab.com:25010/pmn');
//globals
var db = mongoose.connection;
const SESSION_TTL = 60 * 30;//30 minutes
const PORT = 8000;
const APP_NAME = "PMN server v1.0";

/**How to execute Python script from Node**
var PythonShell = require('python-shell');

var options =
{
  mode: 'text',
  //pythonPath: 'path/to/python',
  pythonOptions: ['-u'],
  scriptPath: 'python',
  args: ['argument 1']
};

PythonShell.run('script.py', options, function (err, results)
{
  // script finished
  console.log(err || results);
});*/

/**Root route handler**/
app.get('/',function(req,res)
{
  res.send('Use /api/*');
});

/**Booking route handlers**/
app.get('/api/booking/:object_id',function(req,res)
{
  bookings.ACCESS_MODE = access_levels.NORMAL;
  getObject(req, res, bookings);
});

app.get('/api/bookings',function(req,res)
{
  bookings.ACCESS_MODE = access_levels.NORMAL;
  getAllObjects(req, res, bookings);
});

app.post('/api/booking/add',function(req,res)
{
  bookings.ACCESS_MODE = access_levels.ADMIN;
  console.log('Booking object: %s', req.body.nails);
  addObject(req, res, bookings);
});

/**User route handlers**/
app.get('/api/user/:object_id',function(req,res)
{
  users.ACCESS_MODE = access_levels.NORMAL;
  getObject(req, res, users);
});

app.get('/api/users',function(req,res)
{
  users.ACCESS_MODE = access_levels.ADMIN;
  getAllObjects(req, res, users);
});

app.post('/api/user/add',function(req, res)
{
  users.ACCESS_MODE = access_levels.NO_ACCESS;//<---Check this out
  addObject(req, res, users);
});

app.post('/api/user/update/:object_id',function(req,res)
{
  users.ACCESS_MODE = access_levels.NORMAL;
  updateObject(req, res, users);
});

/**Paint route handlers**/
app.get('/api/paint/:object_id',function(req,res)
{
  paints.ACCESS_MODE = access_levels.NO_ACCESS;
  getObject(req, res, paints);
});

app.get('/api/paints',function(req,res)
{
  paints.ACCESS_MODE = access_levels.NO_ACCESS;
  getAllObjects(req, res, paints);
});

app.post('/api/paint/add',function(req, res)
{
  paints.ACCESS_MODE = access_levels.ADMIN;
  addObject(req, res, paints);
});

app.post('/api/paint/update/:object_id',function(req,res)
{
  paints.ACCESS_MODE = access_levels.ADMIN;
  updateObject(req, res, paints);
});

/**Tips route handlers**/
app.get('/api/tip/:object_id',function(req,res)
{
  tips.ACCESS_MODE = access_levels.NO_ACCESS;
  getObject(req, res, tips);
});

app.get('/api/tips',function(req,res)
{
  tips.ACCESS_MODE = access_levels.NO_ACCESS;
  getAllObjects(req, res, tips);
});

app.post('/api/tip/add',function(req, res)
{
  tips.ACCESS_MODE = access_levels.ADMIN;
  addObject(req, res, tips);
});

app.post('/api/tip/update/:object_id',function(req,res)
{
  tips.ACCESS_MODE = access_levels.ADMIN;
  updateObject(req, res, tips);
});

/**Services route handlers**/
app.get('/api/service/:object_id',function(req,res)
{
  services.ACCESS_MODE = access_levels.NO_ACCESS;
  getObject(req, res, services);
});

app.get('/api/services',function(req,res)
{
  services.ACCESS_MODE = access_levels.NO_ACCESS;
  getAllObjects(req, res, services);
});

app.post('/api/service/add',function(req, res)
{
  services.ACCESS_MODE = access_levels.ADMIN;
  addObject(req, res, services);
});

app.post('/api/service/update/:object_id',function(req,res)
{
  services.ACCESS_MODE = access_levels.ADMIN;
  updateObject(req, res, services);
});

app.delete('/api/user/delete/:object_id',function(req,res)
{
  /*var id = req.params._id;
  user.removeUser(id,function(err)
  {
    if(err)
    {
      throw err;
    }
    res.send("Deleted user:" + id + "\n");
  });*/
  res.send("Not implemented.");
});

addObject = function(req, res, obj_model)
{
  var obj = req.body;
  var session_id = req.headers.session;
  var session = sessions.search(session_id);

  res.setHeader('Content-Type','text/json');

  //validate obj
  if(!obj_model.isValid(obj))
  {
    errorAndCloseConnection(res, 503, errors.INVALID_DATA);
    return;
  }

  if(obj_model.ACCESS_MODE >= access_levels.NO_ACCESS)
  {
    obj_model.add(obj, function(err)
    {
      if(err)
      {
        errorAndCloseConnection(res, 500, errors.INTERNAL_ERR);
        logServerError(err);
        return;
      }else res.json({'success':'200: Success'});
    });
  }else {
    if(session!=null)
    {
      if(!session.isExpired())
      {
        if(session.access_level>=obj_model.ACCESS_MODE)
        {
          obj_model.add(obj, function(err)
          {
            if(err)
            {
              errorAndCloseConnection(res, 500, errors.INTERNAL_ERR);
              logServerError(err);
              return;
            }
            res.json({'success':'200: Success'});
          });
        }else {
          errorAndCloseConnection(res, 502, errors.UNAUTH);
        }
      }else {
        errorAndCloseConnection(res, 501, errors.SESSION_EXPIRED);
      }
    }else{
      errorAndCloseConnection(res, 501, errors.SESSION_EXPIRED);
    }
  }
}

updateObject = function(req, res, obj_model)
{
  var obj_id = req.params.object_id;
  var obj = req.body;
  var session_id = req.headers.session;
  var session = sessions.search(session_id);

  res.setHeader('Content-Type','text/json');

  if(isNullOrEmpty(obj_id))
  {
    console.log('Invalid object: ' + obj_id)
    errorAndCloseConnection(res, 503, errors.INVALID_DATA);
    return;
  }
  if(!obj_model.isValid(obj))
  {
    console.log('Invalid object: ' + obj)
    errorAndCloseConnection(res, 503, errors.INVALID_DATA);
    return;
  }

  if(session!=null)
  {
    if(!session.isExpired())
    {
      if(session.access_level>=obj_model.ACCESS_MODE)
      {
        obj_model.update(obj_id, obj, function(err)
        {
          if(err)
          {
            errorAndCloseConnection(res, 500, errors.INTERNAL_ERR);
            logServerError(err);
            return;
          }
          res.json({'success':'200: Success'});
        });
      }else {
        errorAndCloseConnection(res, 502, errors.UNAUTH);
      }
    }else {
      errorAndCloseConnection(res, 501, errors.SESSION_EXPIRED);
    }
  }else{
    errorAndCloseConnection(res, 501, errors.SESSION_EXPIRED);
  }
}

getObject = function(req, res, obj_model)
{
  var obj_id = req.params.object_id;
  var session_id = req.headers.session;
  var session = sessions.search(session_id);

  if(isNullOrEmpty(obj_id))
  {
    errorAndCloseConnection(res,503,errors.INVALID_DATA);
    return;
  }

  res.setHeader('Content-Type','text/json');

  if(obj_model.ACCESS_MODE >= access_levels.NO_ACCESS)
  {
    obj_model.get(obj_id, function(err, obj)
    {
      if(err)
      {
        errorAndCloseConnection(res,500,errors.INTERNAL_ERR);
        logServerError(err);
      }
      res.json(obj);
    });
  }else {
    if(session!=null)
    {
      if(!session.isExpired())
      {
        if(session.access_level>=obj_model.ACCESS_MODE)
        {
          obj_model.get(obj_id, function(err, obj)
          {
            if(err)
            {
              errorAndCloseConnection(res,500,errors.INTERNAL_ERR);
              logServerError(err);
            }
            res.json(obj);
          });
        }else {
          errorAndCloseConnection(res,502,errors.UNAUTH);
        }
      }else {
        errorAndCloseConnection(res,501,errors.SESSION_EXPIRED);
      }
    }else {
      errorAndCloseConnection(res,501,errors.SESSION_EXPIRED);
    }
  }
}

getAllObjects = function(req, res, obj_model)
{
  var session_id = req.headers.session;
  var session = sessions.search(session_id);

  res.setHeader('Content-Type','text/json');

  if(obj_model.ACCESS_MODE >= access_levels.NO_ACCESS)
  {
    obj_model.getAll(function(err, objs)
    {
      if(err)
      {
        errorAndCloseConnection(res,500,errors.INTERNAL_ERR);
        logServerError(err);
      }
      res.json(objs);
    });
  }else {
    if(session!=null)
    {
      if(!session.isExpired())
      {
        if(session.access_level>=obj_model.ACCESS_MODE)
        {
          obj_model.getAll(function(err, objs)
          {
            if(err)
            {
              errorAndCloseConnection(res,500,errors.INTERNAL_ERR);
              logServerError(err);
            }
            res.json(objs);
          });
        }else {
          errorAndCloseConnection(res,502,errors.UNAUTH);
        }
      }else {
        errorAndCloseConnection(res,501,errors.SESSION_EXPIRED);
      }
    }else {
      errorAndCloseConnection(res,501,errors.SESSION_EXPIRED);
    }
  }
}

errorAndCloseConnection = function(res,status,msg)
{
  res.status(status);
  res.setHeader('Connection','close');
  res.json({'error':msg});
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

logServerError = function(err)
{
  //TODO: log to file
  console.error(err.stack);
}

/**** user authentication ****/
app.post('/api/auth',function(req, res)
{
  var usr = req.body.usr;
  var pwd = req.body.pwd;

  res.setHeader('Content-Type','text/json');

  //validate input from client
  if(isNullOrEmpty(usr) || isNullOrEmpty(pwd))
  {
    errorAndCloseConnection(res, 404, errors.NOT_FOUND);
    return;
  }

  //check if credentials match the ones in the database
  users.validate(usr, pwd, function(err, user)
  {
    if(err)
    {
      errorAndCloseConnection(res,500,errors.INTERNAL_ERR);
      logServerError(err);
    }
    if(user)
    {
      var session = sessions.newSession(user._id, SESSION_TTL, user.access_level);
      res.setHeader('Session','session=' + session.session_id + ';ttl=' + session.ttl +
                      ';date=' + session.date_issued);
      res.setHeader('Content-Type','text/plain');
      res.send(session.session_id);
    }else{
      errorAndCloseConnection(res,404,errors.NOT_FOUND);
    }
  });
});

app.listen(PORT);
console.log('..::%s Server running at localhost on port %s::..',APP_NAME, PORT);
