var React = require("react"),
  ReactRouter = require("react-router"),
  Link = ReactRouter.Link;

var HomePage = React.createClass({
  render: function(){
    return (
      <div className="container text-center">
        <h1>Welcome to WEB APP IDE</h1>
        <ul className="list-unstyled">
          <li>Build your own site with multiple pages</li>
          <li>With forms that save data to your own database</li>
          <li>Manage and edit your database and data</li>
          <li>All from your browser</li>
        </ul>
        <Link className="btn btn-lg btn-primary" to="createSite">Create a Site Now</Link>
      </div>
    );
  }
});

module.exports = HomePage;
