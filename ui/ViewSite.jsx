var React = require("react"),
  Reflux = require("reflux"),
  ReactRouter = require("react-router"),
  SitesActions = require("./SitesActions"),
  SitesStore = require("./SitesStore"),
  Pages = require("./Pages");

var ViewSite = React.createClass({
  mixins: [ReactRouter.State, Reflux.connect(SitesStore)],
  getInitialState: function(){
    var siteId = this.getParams().siteId;

    return {siteId: siteId};
  },
  componentDidMount: function(){
    SitesActions.loadSite(this.state.siteId);
  },
  render: function () {
    if(this.state.loadingSite) {
      return (
        <ProgressBar message="Loading" />
      );
    }

    return (
      <div>
        <h1>View Site {this.getParams().siteId}</h1>
        {this.state.loadedSite ? <Pages pages={this.state.loadedSite.pages} siteId={this.state.siteId} /> : null}
      </div>
    );
  }
});

module.exports = ViewSite;
