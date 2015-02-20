var React = require("react"),
  ReactRouter = require("react-router"),
  Link = ReactRouter.Link,
  Reflux = require("reflux"),
  DatabaseStore = require("./DatabaseStore"),
  DatabaseActions = require("./DatabaseActions"),
  ProgressBar = require("./ProgressBar");

var DatabaseDesigner = React.createClass({
  mixins: [Reflux.connect(DatabaseStore)],
  componentDidMount: function(){
    DatabaseActions.loadResources();
  },
  render: function(){
    if(this.state.loading){
      return <ProgressBar message="Loading" />
    }

    var resourcesRows = this.state.resources.map(function(resource){
      return (
        <tr key={resource.id}>
          <td><Link to="resourceDesigner" query={{id: resource.id}}>{resource.name}</Link></td>
          <td><Link to="dataEditor" query={{id: resource.id}}>View Data</Link></td>
        </tr>
      );
    });

    return (
      <div>
        <h1>Database Designer</h1>
        <Link className="btn btn-primary" to="resourceDesigner">Create New Resource</Link>

        <h2>Resource</h2>

        <table className="table table-bordered table-condensed table-hover table-striped">
          <thead>
            <th>Name</th>
            <th>Data</th>
          </thead>
          <tbody>
            {resourcesRows}
          </tbody>
        </table>
      </div>
    );
  }
});

module.exports = DatabaseDesigner;
