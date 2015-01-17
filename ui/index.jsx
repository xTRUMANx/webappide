var React = require("react"),
  ReactRouter = require("react-router"),
  Route = ReactRouter.Route,
  DefaultRoute = ReactRouter.DefaultRoute,
  RouteHandler = ReactRouter.RouteHandler,
  Link = ReactRouter.Link;

var PageBuilder = require("./PageBuilder");

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
                <Link to="pageBuilder">Page Builder</Link>
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
    <Route name="pageBuilder" path="builder" handler={PageBuilder} />
  </Route>
);

ReactRouter.run(routes, function(Handler){
  React.render(<Handler />, window.document.getElementById("appContainer"));
});
