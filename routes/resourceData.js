var Express = require("express"),
  Router = Express.Router,
  DB = require("../db");

var router = Router();

router.post("/", function(req, res, next){
  var resourceData = req.body;

  DB.
    saveResourceData(resourceData).
    then(function(id){
      res.json(id);
    }).
    fail(function(err){
      next(err);
    });
});

module.exports = router;
