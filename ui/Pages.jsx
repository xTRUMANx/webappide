var React = require("react"),
  ReactRouter = require("react-router"),
  Link = ReactRouter.Link,
  Reflux = require("reflux"),
  SitesActions = require("./SitesActions"),
  ProgressBar = require("./ProgressBar");

var Pages = React.createClass({
  getInitialState: function(){
    return {deleting: {}};
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
          var deleting = this.state.deleting;

          deleting[page.id] = false;

          this.setState({deleting: deleting});
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
            <Link to="previewPage" params={{siteId: this.props.siteId, pageId: page.id}} className="btn btn-info btn-xs slight-margin">Preview</Link>
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
