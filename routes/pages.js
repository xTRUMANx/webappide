var Express = require("express"),
  Router = Express.Router,
  DB = require("../db");

var router = Router();

router.get("/", function(req, res){
  if(req.query.id){
    DB.
      getPage(req.query.id).
      then(function(page){
        res.json(page);
      });
  }
  else if(req.query.layoutsPagesOnly){
    DB.
      getLayoutPages().
      then(function(pages){
        res.json(pages);
      });
  }
  else{
    DB.
      getPages().
      then(function(pages){
        res.json(pages);
      });
  }
});

router.post("/", function(req, res){
  var page = req.body;

  DB.
    savePage(page).
    then(function(pageId){
      res.json({pageId: pageId});
    }).
    fail(function(err){
      throw new Error(err);
    });
});

router.delete("/", function(req, res){
  var id = req.query.id;

  DB.
    deletePage(id).
    then(function(){
      res.end();
    }).
    fail(function(err){
      throw new Error(err);
    });
});

module.exports = router;
