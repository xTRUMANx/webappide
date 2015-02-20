var React = require("react"),
  ReactRouter = require("react-router"),
  Route = ReactRouter.Route,
  DefaultRoute = ReactRouter.DefaultRoute,
  RouteHandler = ReactRouter.RouteHandler,
  Link = ReactRouter.Link;

var PageDesigner = require("./PageDesigner"),
  PreviewPage = require("./PreviewPage"),
  DatabaseDesigner = require("./DatabaseDesigner"),
  ResourceDesigner = require("./ResourceDesigner"),
  DataEditor = require("./DataEditor");

var Pages = require("./Pages");

var App = React.createClass({
  render: function(){
    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <Link className="navbar-brand" to="/">React Web Builder</Link>
            </div>
            <ul className="nav navbar-nav">
              <li>
                <Link to="pages">Pages</Link>
              </li>
              <li>
                <Link to="pageDesigner">Page Designer</Link>
              </li>
              <li>
                <Link to="databaseDesigner">Database Designer</Link>
              </li>
            </ul>
          </div>
        </nav>
        <RouteHandler />
      </div>
    );
  }
});

var routes = (
  <Route path="/" handler={App}>
    <DefaultRoute name="pages" path="" handler={Pages} />
    <Route name="pageDesigner" path="pageDesigner" handler={PageDesigner} />
    <Route name="databaseDesigner" path="databaseDesigner" handler={DatabaseDesigner} />
    <Route name="resourceDesigner" path="resourceDesigner" handler={ResourceDesigner} />
    <Route name="dataEditor" handler={DataEditor} />
    <Route name="previewPage" path="preview" handler={PreviewPage} />
  </Route>
);

ReactRouter.run(routes, function(Handler){
  React.render(<Handler />, window.document.getElementById("appContainer"));
});
