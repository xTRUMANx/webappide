var React = require("react"),
  ReactRouter = require("react-router"),
  AuthenticationActions = require("./AuthenticationActions"),
  ProgressBar = require("./ProgressBar");

var LogoutPage = React.createClass({
  mixins: [ReactRouter.Navigation],
  getInitialState: function(){
    return {};
  },
  componentDidMount: function(){
    AuthenticationActions.
      logout.
      triggerPromise().
      then(function(){
        this.transitionTo("/");
      }.bind(this)).
      catch(function(){
        this.setState({logoutFailed: true});
      }.bind(this));
  },
  render: function(){
    return this.state.logoutFailed ? <h1>Logout Failed. Try refreshing.</h1> : <ProgressBar message="Logging out" />;
  }
});

module.exports = LogoutPage;
