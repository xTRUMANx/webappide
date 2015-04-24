var Express = require("express"),
  Router = Express.Router,
  DB = require("../db");

var router = Router();

router.get("/", function(req, res, next){
  if(req.query.id){
    DB.
      getPage(req.query.id).
      then(function(page){
        res.json(page);
      }).
      fail(function(err){
        next(err);
      });
  }
  else if(req.query.layoutsPagesOnly){
    DB.
      getLayoutPages().
      then(function(pages){
        res.json(pages);
      }).
      fail(function(err){
        next(err);
      });
  }
  else{
    DB.
      getPages().
      then(function(pages){
        res.json(pages);
      }).
      fail(function(err){
        next(err);
      });
  }
});

router.post("/", function(req, res, next){
  var page = req.body,
    siteId = req.query.siteId;

  DB.
    savePage(page, siteId).
    then(function(pageId){
      res.json({pageId: pageId});
    }).
    fail(function(err){
      next(err);
    });
});

router.delete("/", function(req, res, next){
  var id = req.query.id;

  DB.
    deletePage(id).
    then(function(){
      res.end();
    }).
    fail(function(err){
      next(err);
    });
});

router.put("/homePage", function(req, res, next){
  DB.
    setAsHomePage(req.query.id).
    then(function(){
      res.end();
    }).
    fail(function(err){
      next(err);
    });
});

module.exports = router;
