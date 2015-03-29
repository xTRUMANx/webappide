var Express = require("express"),
  Router = Express.Router,
  DB = require("../db");

var router = Router();

router.post("/", function(req, res, next){
  var resource = req.body;

  DB.
    saveResource(resource).
    then(function(id){
      res.json({id: id});
    }).
    fail(function(err){
      next(err);
    });
});

router.get("/", function(req, res, next){
  var id = Number(req.query.id);

  if(id){
    DB.
      getResource(id).
      then(function(resource){
        res.json(resource);
      }).
      fail(function(err){
        next(err);
      });
  }
  else{
    DB.
      getResources().
      then(function(resources){
        res.json(resources);
      }).
      fail(function(err){
        next(err);
      });
  }
});

module.exports = router;
