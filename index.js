var express = require("express"),
  debug = require("debug"),
  path = require("path");

var app = express();

var log = debug("react-web-buider");

app.use(express.static(path.join(__dirname, "public")));

app.set("port", process.env.PORT || 3000);

var server = app.listen(app.get("port"), function(){
  log("Server is running at port " + server.address().port);
});