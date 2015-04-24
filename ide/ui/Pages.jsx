var React = require("react"),
  ReactRouter = require("react-router"),
  Link = ReactRouter.Link,
  Reflux = require("reflux"),
  SitesActions = require("webappide-core/SitesActions"),
  ProgressBar = require("webappide-core/ProgressBar");

var Pages = React.createClass({
  getInitialState: function(){
    return {deleting: {}, settingAsHomePage: {}};
  },
  delete: function(page){
    var deletionConfirmation = confirm("Are you sure you want to delete this page?\nPage: " + page.data.properties.title);

    if(deletionConfirmation) {
      var deleting = this.state.deleting;

      deleting[page.id] = true;

      this.setState({deleting: deleting});

      SitesActions.
        deletePage.
        triggerPromise(page).
        then(function(){
          var deleting = this.state.deleting;

          deleting[page.id] = false;

          this.setState({deleting: deleting});
        }.bind(this)).
        catch(function(){
          // TODO: Alert user that operation has failed
          var deleting = this.state.deleting;

          deleting[page.id] = false;

          this.setState({deleting: deleting});
        }.bind(this));
    }
  },
  setAsHomePage: function(page){
    var setAsHomePageConfirmation = confirm("Are you sure you want to set this page as the site's home page?\nPage: " + page.data.properties.title);

    if(setAsHomePageConfirmation) {
      var settingAsHomePage = this.state.settingAsHomePage;

      settingAsHomePage[page.id] = true;

      this.setState({settingAsHomePage: settingAsHomePage});

      SitesActions.
        setAsHomePage.
        triggerPromise(page).
        then(function(){
          var settingAsHomePage = this.state.settingAsHomePage;

          settingAsHomePage[page.id] = false;

          this.setState({settingAsHomePage: settingAsHomePage});
        }.bind(this)).
        catch(function(){
          // TODO: Alert user that operation has failed
          var settingAsHomePage = this.state.settingAsHomePage;

          settingAsHomePage[page.id] = false;

          this.setState({settingAsHomePage: settingAsHomePage});
        }.bind(this));
    }
  },
  render: function(){
    if(this.state.loading) {
      return (
        <ProgressBar message="Loading" />
      );
    }

    var pages = this.props.pages || [];

    var rows = pages.map(function(page, index){
      return (
        <tr key={index}>
          <td>
            <button className="btn btn-danger btn-xs slight-margin" title="Delete Page" disabled={this.state.deleting[page.id]} onClick={this.delete.bind(this, page)}>
              <span className="glyphicon glyphicon-remove"></span>
            </button>
            <button className="btn btn-success btn-xs slight-margin" title="Set as Home Page" disabled={this.state.settingAsHomePage[page.id]} onClick={this.setAsHomePage.bind(this, page)}>
              <span className="glyphicon glyphicon-home"></span>
            </button>
            <Link to="previewPage" title="Preview Page" params={{siteId: this.props.siteId, pageId: page.id}} className="btn btn-info btn-xs slight-margin">
              <span className="glyphicon glyphicon-search"></span>
            </Link>
          </td>
          <td>
            <Link to="pageDesigner" params={{siteId: this.props.siteId, pageId: page.id}}>{page.data.properties.title}</Link>
          </td>
        </tr>
      );
    }.bind(this));

    return (
      <div>
        {this.state.err ? <p className="alert alert-danger">Failed to load data. Try refreshing. {this.state.err}</p> : null}
        <Link className="btn btn-primary" to="pageDesigner" params={{siteId: this.props.siteId}}>Create New Page</Link>
        <table className="table table-bordered table-condensed table-hover table-striped">
          <thead>
            <th className="col-xs-4">Actions</th>
            <th>Page Title</th>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
});

module.exports = Pages;
