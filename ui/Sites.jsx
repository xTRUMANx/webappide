var React = require("react"),
  ReactRouter = require("react-router"),
  RouteHandler = ReactRouter.RouteHandler;

var Sites = React.createClass({
  render: function () {
    return (
      <RouteHandler />
    );
  }
});

module.exports = Sites;
