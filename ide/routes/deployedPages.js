var Express = require("express"),
  Router = Express.Router,
  DB = require("../db");

var router = Router();

router.get("/", function(req, res, next){
  if(req.query.id){
    DB.
      getDeployedPage(req.query.id).
      then(function(page){
        res.json(page);
      }).
      fail(function(err){
        next(err);
      });
  }
  else if(req.query.layoutsPagesOnly){
    DB.
      getDeployedLayoutPages().
      then(function(pages){
        res.json(pages);
      }).
      fail(function(err){
        next(err);
      });
  }
  else{
    next();
  }
});

module.exports = router;
