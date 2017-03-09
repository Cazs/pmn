http = require("http");

http.createServer(function(req,res)
{
  res.setHeader("Content-Type","text/html");
  //res.sendFile(__dirname+"/public/logo.png");
  res.end("<h1>It works!<br/>Project path:"+__dirname+"</h1>");
}).listen(4000,function()
{
  console.log("Server listening on port 4000....");
});
