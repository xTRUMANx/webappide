var express = require("express"),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  debug = require("debug"),
  path = require("path"),
  apiRoutes = require("./routes/api"),
  session = require("express-session"),
  RedisStore = require("connect-redis")(session),
  NodeNotifier = require("node-notifier");

var app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());

app.use(morgan("dev"));

app.use(session({
  store: new RedisStore({
    host: "127.0.0.1",
    port: 6379
  }),
  secret: "mysupersecretsessionsecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  }
}));

app.use("/api", apiRoutes);

app.use(function(err, req, res, next){
  console.log(err);

  res.status(500).end();
});

app.set("port", process.env.PORT || 3000);

var log = debug("react-web-buider");

var server = app.listen(app.get("port"), function () {
  log("Server is running at port " + server.address().port);

  if(process.env.NODE_ENV !== "production") {
    NodeNotifier.notify({
      title: 'WEB APP IDE',
      message: 'Server (re)started!',
      icon: path.join(__dirname, "logo.svg")
    });
  }
});
