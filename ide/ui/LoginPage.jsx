var React = require("react"),
  Reflux = require("reflux"),
  ReactRouter = require("react-router"),
  AuthenticationActions = require("webappide-core/AuthenticationActions"),
  AuthenticationStore = require("webappide-core/AuthenticationStore"),
  ProgressBar = require("webappide-core/ProgressBar");

var LoginPage = React.createClass({
  mixins: [ReactRouter.Navigation, Reflux.connect(AuthenticationStore, "AuthenticationStoreState")],
  getInitialState: function(){
    return {};
  },
  submit: function(e){
    e.preventDefault();

    var email = this.refs.email.getDOMNode().value;
    var password = this.refs.password.getDOMNode().value;

    var credentials = {email: email, password: password};

    AuthenticationActions.
      login.
      triggerPromise(credentials).
      then(function(){
        this.transitionTo("/sites");
      }.bind(this)).
      catch(function(err){
        if(err.invalidCredentials){
          this.setState({invalidCredentials: true});
        }
        else{
          this.setState({loginFailed: true});
        }
      }.bind(this));
  },
  render: function(){
    return (
      <div className="container">
        <form className="form-horizontal col-lg-8 col-lg-offset-2" onSubmit={this.submit}>
          <h2 className="text-center">Login</h2>
          {this.state.invalidCredentials ? <p className="alert alert-danger">Invalid Credentials. Try again.</p> : null}
          {this.state.loginFailed ? <p className="alert alert-danger">Login Failed. Try again.</p> : null}
          <div className="form-group">
            <label className="control-label col-sm-5">Email</label>
            <div className="col-sm-7">
              <input className="form-control" type="email" ref="email" />
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-5">Password</label>
            <div className="col-sm-7">
              <input className="form-control" type="password" ref="password" />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-7 col-sm-offset-5">
              <input className="btn btn-primary" type="submit" value="Login" disabled={this.state.AuthenticationStoreState.loggingIn} />
              {this.state.AuthenticationStoreState.loggingIn ? <ProgressBar message="Loggin In" /> : null}
            </div>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = LoginPage;
