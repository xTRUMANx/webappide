var React = require("react"),
  ReactRouter = require("react-router"),
  Route = ReactRouter.Route;

var PageBuilder = require("./PageBuilder");

var routes = (
  <Route handler={PageBuilder}>
  </Route>
);

ReactRouter.run(routes, function(Handler){
  React.render(<Handler />, window.document.getElementById("appContainer"));
});
