var Express = require("express"),
  Router = Express.Router,
  Crypto = require("crypto"),
  DB = require("../db"),
  Q = require("q");

var router = Router();

var passwordHashIterations = 128000,
  passwordKeyLength = 20;

router.post("/register", function(req, res, next){
  var registrationForm = req.body;

  ValidationRegistrationForm(registrationForm).
    then(function(validationErrors){
      if(Object.keys(validationErrors).length){
        res.status(400).json({validationErrors: validationErrors});
      }
      else{
        registrationForm.email = registrationForm.email.trim();

        Crypto.pbkdf2(registrationForm.password, registrationForm.email, passwordHashIterations, passwordKeyLength, function(err, derivedKey){
          registrationForm.hashedPassword = derivedKey.toString("hex");

          DB.
            registerUser(registrationForm).
            then(function(){
              if(req.session.createdSite){
                DB.
                  transferSites(req.session.id, registrationForm.email).
                  then(function(){
                    req.session.userId = registrationForm.email;

                    res.json({userId: registrationForm.email});
                  });
              }
              else{
                req.session.userId = registrationForm.email;

                res.json({userId: registrationForm.email});
              }
            }).
            fail(function(err){
              next(err);
            });
        });
      }
    }).
    fail(function(err){
      next(err);
    });;
});

router.post("/login", function(req, res, next){
  var credentials = req.body;

  Crypto.pbkdf2(credentials.password, credentials.email, passwordHashIterations, passwordKeyLength, function(err, derivedKey){
    credentials.hashedPassword = derivedKey.toString("hex");

    DB.
      authenticate(credentials).
      then(function(validCredentials){
        if(validCredentials){
          if(req.session.createdSite){
            DB.
              transferSites(req.session.id, credentials.email).
              then(function(){
                req.session.userId = credentials.email;

                res.json({userId: credentials.email});
              });
          }
          else{
            req.session.userId = credentials.email;

            res.json({userId: credentials.email});
          }
        }
        else{
          res.status(401).end();
        }
      }).
      fail(function(err){
        next(err);
      });
  });
});

router.get("/logout", function(req, res, next){
  req.session.destroy(function(err){
    if(err) return next(err);

    res.end();
  });
});

router.get("/whoami", function(req, res, next){
  if(req.session.userId !== req.session.id){
    res.json({userId: req.session.userId})
  }
  else{
    res.end();
  }
});

function ValidationRegistrationForm(registrationForm){
  var deferred = Q.defer();

  var errs = {};

  if(!registrationForm.email || !registrationForm.email.trim()){
    errs["email"] = ["Email is required."];
  }
  else if(!registrationForm.password || !registrationForm.password.trim()){
    errs["password"] = ["Password is required."];
  }

  if(errs.email || errs.password){
    return deferred.resolve(errs);
  }

  DB.
    emailInUse(registrationForm.email.trim()).
    then(function(emailInUse){
      if(emailInUse){
        errs["email"] = ["Email in use."];
      }

      deferred.resolve(errs);
    }).
    fail(function(err){
      deferred.reject(err);
    });

  return deferred.promise;
}

module.exports = router;
