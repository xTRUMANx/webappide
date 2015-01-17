var React = require("react"),
  ReactRouter = require("react-router"),
  Link = ReactRouter.Link;

var Pages = React.createClass({
  render: function(){
    var pages = "123".split("").map(function(v){return {id: v, title: "Page " + v}});

    var rows = pages.map(function(page){
      return (
        <tr>
          <td>
            <Link to="pageBuilder" query={{id: page.id}}>{page.title}</Link>
          </td>
        </tr>
      );
    });

    return (
      <div>
        <h1>Pages</h1>
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
