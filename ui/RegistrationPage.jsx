var React = require("react"),
  ReactRouter = require("react-router"),
  AuthenticationActions = require("./AuthenticationActions"),
  AuthenticationStore = require("./AuthenticationStore");

var RegistrationPage = React.createClass({
  mixins: [ReactRouter.Navigation, Reflux.connect(AuthenticationStore)],
  submit: function(e){
    e.preventDefault();

    var email = this.refs.email.getDOMNode().value;
    var password = this.refs.password.getDOMNode().value;
    var password2 = this.refs.password2.getDOMNode().value;

    var passwordsDontMatch = password !== password2;

    this.setState({passwordsDontMatch: passwordsDontMatch});

    if(passwordsDontMatch){
      return;
    }

    this.setState({registering: true});

    AuthenticationActions.
      register.
      triggerPromise(email, password).
      then(function(){
        this.transitionTo("/sites");
      }.bind(this)).
      catch(function(err){
        this.setState({registering: false});

        if(err.validationErrors){
          this.setState({validationErrors: err.validationErrors});

          return;
        }

        console.log("catch", arguments);
      }.bind(this));
  },
  render: function(){
    var passwordDontMatchClass = this.state.passwordsDontMatch ? " has-error" : "";

    var emailClass = this.state.validationErrors && this.state.validationErrors["email"] ? " has-error" : "";

    return (
      <div className="container">
        <form className="form-horizontal col-lg-8 col-lg-offset-2" onSubmit={this.submit}>
          <h2 className="text-center">Registration</h2>
          <div className={"form-group" + emailClass}>
            <label className="control-label col-sm-3">Email</label>
            <div className="col-sm-9">
              <input className="form-control" type="email" required={true} ref="email" />
              {this.state.validationErrors && this.state.validationErrors["email"] ? <p className="help-block">{this.state.validationErrors["email"]}</p> : null}
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-3">Password</label>
            <div className="col-sm-9">
              <input className="form-control" type="password" required={true} ref="password" />
            </div>
          </div>
          <div className={"form-group" + passwordDontMatchClass}>
            <label className="control-label col-sm-3">Confirm Password</label>
            <div className="col-sm-9">
              <input className="form-control" type="password" required={true} ref="password2" />
              {this.state.passwordsDontMatch ? <p className="help-block">Passwords don't match</p> : null}
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-9 col-sm-offset-3">
              <input className="btn btn-primary" type="submit" value="Register" disabled={this.state.registering} />
            </div>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = RegistrationPage;
