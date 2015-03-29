var Express = require("express"),
  Router = Express.Router,
  DB = require("../db");

var router = Router();

router.get("/", function(req, res, next){
  var resourceId = req.query.resourceId;

  DB.
    getAllResourceData(resourceId).
    then(function(allResourceData){
      res.json(allResourceData);
    }).
    fail(function(err){
      next(err);
    });
});

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
