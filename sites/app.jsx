var React = require("react"),
  ReactRouter = require("react-router"),
  Route = ReactRouter.Route;

var ElementRenderer = require("webappide-core/ElementRenderer");
var ProgressBar = require("webappide-core/ProgressBar");

var App = React.createClass({
  render: function(){
    return (
      <html>
        <head>
          <title>{this.props.elementsTree.properties.title}</title>
          <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css"/>
        </head>
        <body>
          <ElementRenderer element={this.props.elementsTree} layoutPage={this.props.layoutPage} resources={this.props.resources} siteId={this.props.siteId} />
        </body>
      </html>
    );
  }
});

var routes = (
  <Route name="/" handler={App} />
);

module.exports = routes;
