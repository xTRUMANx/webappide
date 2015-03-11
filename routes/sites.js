var Express = require("express"),
  Router = Express.Router,
  DB = require("../db");

var router = Router();

router.get("/", function(req, res, next){
  var id = req.query.id;

  if(id){
    DB.
      getSite(id).
      then(function(site){
        res.json(site);
      }).
      fail(function(err){
        next(err);
      });
  }
  else{
    DB.
      getSites().
      then(function(sites){
        res.json(sites);
      }).
      fail(function(err){
        next(err);
      });
  }
});

router.post("/", function(req, res, next){
  console.log(req.body);

  DB.
    saveSite(req.body).
    then(function(id){
      res.json({id: id});
    }).
    fail(function(err){
      next(err);
    });
});

module.exports = router;
