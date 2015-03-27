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

    return { siteId: siteId };
  },
  componentDidMount: function(){
    SitesActions.loadSite(this.state.siteId);
  },
  deploy: function(e){
    e.preventDefault();

    var deploymentMessage = this.refs.deploymentMessage.getDOMNode().value;

    SitesActions.
      deploySite.
      triggerPromise(deploymentMessage, this.state.siteId);
  },
  render: function () {
    if(!this.state.loadedSite || this.state.loadingSite || this.state.loadingDeployments) {
      return (
        <ProgressBar message="Loading" />
      );
    }

    var deployments;

    if(this.state.loadedDeployments){
      var deploymentsRows = this.state.loadedDeployments.map(function(deployment, index){
        return (
          <tr key={index}>
            <td>{deployment.message}</td>
            <td>{deployment.deployedOn}</td>
            <td>{deployment.pages}</td>
          </tr>
        );
      });

      var deployments = (
        <table className="table table-bordered table-condensed table-hover table-striped">
          <thead>
            <tr>
              <th>Message</th>
              <th>Deployed On</th>
              <th>Pages</th>
            </tr>
          </thead>
          <tbody>
            {deploymentsRows}
          </tbody>
        </table>
      );
    }

    return (
      <div>
        <h1>View Site {this.state.loadedSite.name}</h1>
        <div className="row">
          <div className="col-sm-6">
            <h2>Pages</h2>
            {this.state.loadedSite ? <Pages pages={this.state.loadedSite.pages} siteId={this.state.siteId} /> : null}
          </div>
          <div className="col-sm-6">
            <h2>Deploys</h2>
            <form onSubmit={this.deploy}>
              <div className="form-group">
                <label className="control-label">Deployment Message</label>
                <div className="input-group">
                  <input className="form-control" ref="deploymentMessage" placeholder="e.g. Updated home page, changed layout, etc." />
                  <span className="input-group-btn">
                    <button className="btn btn-success" type="submit">
                      Deploy
                    </button>
                  </span>
                </div>
              </div>
            </form>
            <h3>Deployments</h3>
            {deployments ? deployments : <p>No deployments for this site is available.</p>}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ViewSite;
