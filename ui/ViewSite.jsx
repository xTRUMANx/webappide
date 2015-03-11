var React = require("react"),
  Reflux = require("reflux"),
  ReactRouter = require("react-router"),
  SitesActions = require("./SitesActions"),
  SitesStore = require("./SitesStore");

var ViewSite = React.createClass({
  mixins: [ReactRouter.State, Reflux.connect(SitesStore)],
  componentDidMount: function(){
    var siteId = this.getParams().siteId;

    SitesActions.loadSite(siteId);
  },
  render: function () {
    return (
      <div>
        <h1>View Site {this.getParams().siteId}</h1>
        {this.state.loadedSite}
      </div>
    );
  }
});

module.exports = ViewSite;
