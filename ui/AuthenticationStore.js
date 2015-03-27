var Reflux = require("reflux"),
  Request = require("request"),
  AuthenticationActions = require("./AuthenticationActions");

var AuthenticationStore = Reflux.createStore({
  listenables: [AuthenticationActions],
  init: function(){
    this.saveFailed = false;
    this.saving = false;
    this.checkingSession = true;
  },
  getInitialState: function(){
    return this.emittedData();
  },
  emittedData: function(){
    return {
      userId: this.userId,
      loggingIn: this.loggingIn,
      checkingSession: this.checkingSession
    };
  },
  emit: function(){
    this.trigger(this.emittedData());
  },
  onRegister: function(email, password){
    Request({
      url: "http://localhost:3000/api/authentication/register",
      method: "POST",
      body: { email: email, password: password },
      json: true
    }, function(err, res, body){
      if(err || res.statusCode !== 200){
        AuthenticationActions.register.failed(err || body || res.statusCode);
      }
      else{
        this.userId = body.userId;

        AuthenticationActions.register.completed();

        this.emit();
      }
    }.bind(this));
  },
  onLogin: function(credentials){
    this.loggingIn = true;

    this.emit();

    Request({
      url: "http://localhost:3000/api/authentication/login",
      method: "POST",
      body: credentials,
      json: true,
    }, function(err, res, body){
      if(err || res.statusCode !== 200){
        if(res.statusCode === 401) {
          AuthenticationActions.login.failed({invalidCredentials: true});
        }
        else{
          AuthenticationActions.login.failed(err || body || res.statusCode);
        }
      }
      else{
        this.userId = body.userId;

        AuthenticationActions.login.completed();
      }

      this.loggingIn = false;

      this.emit();
    }.bind(this));
  },
  onLogout: function(){
    Request({
      url: "http://localhost:3000/api/authentication/logout",
    }, function(err, res, body){
      if(err || res.statusCode !== 200){
        AuthenticationActions.logout.failed(err || body || res.statusCode);
      }
      else{
        delete this.userId;

        AuthenticationActions.logout.completed();

        this.emit();
      }
    }.bind(this));
  },
  onCheckSession: function(){
    this.checkingSession = true;
    this.emit();

    Request({
      url: "http://localhost:3000/api/authentication/whoami",
      json: true,
    }, function(err, res, body){
      if(!err && res.statusCode === 200){
        if(body && body.userId){
          this.userId = body.userId;

          this.emit();
        }
      }

      this.checkingSession = false;

      this.emit();
    }.bind(this));
  }
});

module.exports = AuthenticationStore;
