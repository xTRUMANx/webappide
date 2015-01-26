var express = require("express"),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  debug = require("debug"),
  path = require("path"),
  apiRoutes = require("./routes/api");

var app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());

app.use(morgan("dev"));

app.use("/api", apiRoutes);

app.use(function(err, req, res, next){
  console.log(err.stack);

  res.status(500).end();
});

app.set("port", process.env.PORT || 3000);

var log = debug("react-web-buider");

var server = app.listen(app.get("port"), function () {
  log("Server is running at port " + server.address().port);
});

