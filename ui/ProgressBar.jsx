var React = require("react");

var ProgressBar = React.createClass({
  render: function(){
    return (
      <div>
        <h1 className="text-center">{this.props.message}</h1>
        <div className="progress">
          <div className="progress-bar progress-bar-striped active" style={{width: "100%"}}>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ProgressBar;
