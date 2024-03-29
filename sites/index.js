var Express = require("express"),
  morgan = require("morgan"),
  path = require("path"),
  React = require("react"),
  ReactRouter = require("react-router"),
  ElementRenderer = require("webappide-core/ElementRenderer"),
  Utils = require("webappide-core/Utils"),
  DB = require("./db"),
  UI = require("./app"),
  Q = require("q");

var app = Express();

app.use(Express.static(path.join(__dirname, "public")));

app.use(morgan("dev"));

app.set("port", process.env.PORT || 3001);

app.use(function(req, res){
  Q.spawn(function *(){
    var siteId = Number(req.subdomains[1]);

    if(!siteId){
      console.log("siteId not found", req.subdomains, req.hostname, req.path)

      return res.status(404).send("site not found");
    }

    var pageId;

    if(!req.query.pageId){
      pageId = yield DB.getHomePageId(siteId);
      console.log("pageId", pageId)
      if(!pageId)
        return res.status(404).end();
    }
    else{
      pageId = Number(req.query.pageId);
    }

    var result = yield DB.getDeployedPage(pageId, siteId);

    var resources = yield DB.getResources();

    if(!result.page){
      return res.status(404).send("page not found");
    }

    var page = Utils.setElementParent(result.page);

    var layoutPage = result.layoutPage ?  Utils.setElementParent(result.layoutPage) : null;

    ReactRouter.run(UI, req.url, function(Handler){
      var props = {elementsTree: page, layoutPage: layoutPage, resources: resources, siteId: siteId};

      var serializedPage = JSON.parse(JSON.stringify(props.elementsTree, function(key, value){
        if(key === "parent" && value){
          return value.id;
        }
        else{
          return value;
        }
      }));

      var serializedLayoutPage = JSON.parse(JSON.stringify(props.layoutPage, function(key, value){
        if(key === "parent" && value){
          return value.id;
        }
        else{
          return value;
        }
      }));

      var serializedProps = JSON.stringify({elementsTree: serializedPage, layoutPage: serializedLayoutPage, resources: resources, siteId: siteId});

      props.serializedProps = serializedProps;

      try
      {
        var markup = React.renderToString(React.createElement(Handler, props));

        res.status(200).send(markup);
      }
      catch(e)
      {
        console.log(e)
        res.status(500).end();
      }
    });
  });

  Q.onerror = function(err){
    console.log(err);

    res.status(500).end();
  };
});

app.listen(app.get("port"), function(){
  console.log("Server has started.");
});
