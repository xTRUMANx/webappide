var React = require("react"),
  ReactRouter = require("react-router"),
  Link = ReactRouter.Link,
  Reflux = require("reflux"),
  PagesStore = require("./PagesStore"),
  PagesActions = require("./PagesActions"),
  ProgressBar = require("./ProgressBar");

var Pages = React.createClass({
  mixins: [Reflux.connect(PagesStore)],
  componentDidMount: function(){
    PagesActions.load();
  },
  delete: function(page){
    var deletionConfirmation = confirm("Are you sure you want to delete this page?\nPage: " + page.properties.title);

    if(deletionConfirmation) {
      PagesActions.delete(page.pageId);
    }
  },
  render: function(){
    if(this.state.loading) {
      return (
        <ProgressBar message="Loading"/>
      );
    }

    var pages = this.state.pages || [];

    var rows = pages.map(function(page, index){
      return (
        <tr key={index}>
          <td>
            <button className="btn btn-danger btn-xs slight-margin" title="Delete Page" disabled={this.state.deleting[page.pageId]} onClick={this.delete.bind(this, page)}>
              <span className="glyphicon glyphicon-remove"></span>
            </button>
            <Link to="previewPage" query={{id: page.pageId}} className="btn btn-info btn-xs slight-margin">Preview</Link>
            <Link to="pageBuilder" query={{id: page.pageId}}>{page.properties.title}</Link>
          </td>
        </tr>
      );
    }.bind(this));

    return (
      <div>
        <h1>Pages</h1>
        {this.state.err ? <p className="alert alert-danger">Failed to load data. Try refreshing. {this.state.err}</p> : null}
        <Link className="btn btn-primary" to="pageBuilder">Create New Page</Link>
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
