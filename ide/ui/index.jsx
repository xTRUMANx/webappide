var React = require("react"),
  Reflux = require("reflux"),
  ReactRouter = require("react-router"),
  Route = ReactRouter.Route,
  DefaultRoute = ReactRouter.DefaultRoute,
  RouteHandler = ReactRouter.RouteHandler,
  Link = ReactRouter.Link;

var HomePage = require("./HomePage"),
  PageDesigner = require("./PageDesigner"),
  PreviewPage = require("./PreviewPage"),
  DatabaseDesigner = require("./DatabaseDesigner"),
  ResourceDesigner = require("./ResourceDesigner"),
  DataEditor = require("./DataEditor"),
  ListSites = require("./ListSites"),
  CreateSite = require("./CreateSite"),
  ViewSite = require("./ViewSite"),
  RegistrationPage = require("./RegistrationPage"),
  LoginPage = require("./LoginPage");
  LogoutPage = require("./LogoutPage");

var AuthenticationStore = require("webappide-core/AuthenticationStore"),
  AuthenticationActions = require("webappide-core/AuthenticationActions");

var ProgressBar = require("webappide-core/ProgressBar");

var App = React.createClass({
  mixins: [Reflux.connect(AuthenticationStore, "AuthenticationStoreState")],
  componentDidMount: function(){
    AuthenticationActions.checkSession();
  },
  render: function(){
    if(this.state.AuthenticationStoreState.checkingSession){
      return (
        <ProgressBar message="Looking for an existing session." />
      );
    }

    var authenticationLinks;
    if(this.state.AuthenticationStoreState.userId){
      authenticationLinks = (
        <ul className="nav navbar-nav navbar-right">
          <li>
            <Link to="logout">Logout</Link>
          </li>
        </ul>
      );
    }
    else{
      authenticationLinks = (
        <ul className="nav navbar-nav navbar-right">
          <li>
            <Link to="register">Register</Link>
          </li>
          <li>
            <Link to="login">Login</Link>
          </li>
        </ul>
      );
    }

    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <Link className="navbar-brand" to="/">WEB APP IDE</Link>
            </div>
            <ul className="nav navbar-nav">
              <li>
                <Link to="sites">Sites</Link>
              </li>
              <li>
                <Link to="databaseDesigner">Database Designer</Link>
              </li>
            </ul>
            {authenticationLinks}
          </div>
        </nav>
        <RouteHandler />
      </div>
    );
  }
});

var routes = (
  <Route path="/" handler={App}>
    <DefaultRoute handler={HomePage} />
    <Route name="sites" handler={RouteHandler}>
      <DefaultRoute name="listSites" handler={ListSites} />
      <Route name="createSite" handler={CreateSite} />
      <Route path="view/:siteId" handler={RouteHandler}>
        <DefaultRoute name="viewSite" handler={ViewSite} />
        <Route name="pageDesigner" path="pageDesigner/:pageId?" handler={PageDesigner} />
        <Route name="previewPage" path="preview/:pageId" handler={PreviewPage} />
      </Route>
    </Route>
    <Route name="databaseDesigner" path="databaseDesigner" handler={DatabaseDesigner} />
    <Route name="resourceDesigner" path="resourceDesigner" handler={ResourceDesigner} />
    <Route name="dataEditor" handler={DataEditor} />
    <Route name="register" handler={RegistrationPage} />
    <Route name="login" handler={LoginPage} />
    <Route name="logout" handler={LogoutPage} />
  </Route>
);

ReactRouter.run(routes, function(Handler){
  React.render(<Handler />, window.document.getElementById("appContainer"));
});
