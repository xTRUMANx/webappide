var React = require("react"),
  Reflux = require("reflux"),
  ReactRouter = require("react-router"),
  SitesActions = require("./SitesActions"),
  SitesStore = require("./SitesStore"),
  ProgressBar = require("./ProgressBar");

var CreateSite = React.createClass({
  mixins: [Reflux.connect(SitesStore), ReactRouter.Navigation],
  createSite: function(e){
    e.preventDefault();

    var name = this.refs.name.getDOMNode().value;

    SitesActions.createSite({name: name}, function(siteId){
      this.transitionTo("viewSite", {siteId: siteId});
    }.bind(this));
  },
  render: function () {
    return (
      <div>
        <h1>Create Site</h1>

        {this.state.saving ? <ProgressBar message="Saving Site" /> : null}

        {this.state.saveFailed ? <p className="alert alert-danger">Save Failed</p> : null}

        <form className="form-horizontal" onSubmit={this.createSite}>
          <div className="form-group">
            <label className="control-label col-sm-3">Name</label>
            <div className="col-sm-9">
              <input className="form-control" ref="name" />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-9 col-sm-offset-3">
              <input className="btn btn-primary" type="submit" value="Create Site" disabled={this.state.saving} />
            </div>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = CreateSite;
