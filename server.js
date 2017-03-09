const express = require("express");
const app = express();

app.listen(4242, function()
{
  console.log("Server running on port 4242");
});

app.get('/',(req, res)=>{
  res.sendFile(__dirname+"/public/logo.png");
});
