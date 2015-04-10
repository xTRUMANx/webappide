var React = require("react");

var ProgressBar = React.createClass({displayName: "ProgressBar",
  render: function(){
    return (
      React.createElement("div", null, 
        React.createElement("h1", {className: "text-center"}, this.props.message), 
        React.createElement("div", {className: "progress"}, 
          React.createElement("div", {className: "progress-bar progress-bar-striped active", style: {width: "100%"}}
          )
        )
      )
    );
  }
});

module.exports = ProgressBar;
