var React = require("react"),
  Reflux = require("reflux"),
  ReactRouter = require("react-router"),
  Link = ReactRouter.Link,
  SitesStore = require("webappide-core/SitesStore"),
  SitesActions = require("webappide-core/SitesActions"),
  ProgressBar = require("webappide-core/ProgressBar");

var SitesListing = React.createClass({
  render: function(){
    var sitesListNodes = this.props.sites.map(function(site){
      return (
        <li key={site.id}>
          <Link to="viewSite" params={{siteId: site.id}}>{site.name}</Link>
        </li>
      );
    })
    return (
      <div>
        <h3>{this.props.sites.length} Site(s)</h3>
        <ul>
          {sitesListNodes}
        </ul>
      </div>
    );
  }
});

var ListSites = React.createClass({
  mixins: [Reflux.connect(SitesStore)],
  componentDidMount: function(){
    SitesActions.loadSites();
  },
  render: function () {
    return (
      <div>
        <h1>List Sites</h1>

        {this.state.loadingSites ? <ProgressBar message="Loading Sites" /> : null}

        <Link className="btn btn-default" to="createSite">Create Site</Link>

        {this.state.loadedSites ? <SitesListing sites={this.state.loadedSites} /> : null}
      </div>
    );
  }
});

module.exports = ListSites;
