var PG = require("pg"),
  Q = require("q");

var Config = require("./config");

function executeQuery(sql, sqlArgs, cb){
  if(typeof sqlArgs === "function") {
    cb = sqlArgs;
  }

  var deferred = Q.defer();

  PG.connect(Config.dbConnectionString, function(err, client, done){
    if(err){
      deferred.reject(err);
    }

    client.query(sql, sqlArgs, function(err, results){
      if(err){
        deferred.reject(err);

        done();
      }
      else{
        cb(results, done, deferred);
      }
    });
  });

  return deferred.promise;
}

module.exports = {
  getPages: function(){
    var deferred = Q.defer();

    PG.connect(Config.dbConnectionString, function (err, client, done) {
      if(err){
        deferred.reject(err);
      }

      var sql = "select id, data from pages order by id";

      client.query(sql, function(err, result){
        if(err){
          deferred.reject(err);
        }
        else{
          var pages = result.rows.map(function(row){
            var page = row.data;
            page.pageId = row.id;

            return page;
          });

          deferred.resolve(pages);
        }

        done();
      });
    });

    return deferred.promise;
  },
  getLayoutPages: function(){
    var deferred = Q.defer();

    PG.connect(Config.dbConnectionString, function (err, client, done) {
      if(err){
        deferred.reject(err);
      }

      var sql = "select id, data from pages where data ? 'contentElement'";

      client.query(sql, function(err, result){
        if(err){
          deferred.reject(err);
        }
        else{
          var pages = result.rows.map(function(row){
            var page = row.data;
            page.pageId = row.id;

            return page;
          });

          deferred.resolve(pages);
        }

        done();
      });
    });

    return deferred.promise;
  },
  getPage: function(id){
    var deferred = Q.defer();

    PG.connect(Config.dbConnectionString, function (err, client, done) {
      if(err){
        deferred.reject(err);
      }

      var sql = "select id, data from pages where id = $1";

      client.query(sql, [id], function(err, results){
        if(err){
          deferred.reject(err);

          done();
        }
        else{
          var page;

          if(results.rowCount) {
            var row = results.rows[0];
            page = row.data;
            page.pageId = row.id;
          }

          if(page.properties.layout){
            client.query("select id, data from pages where id = $1", [page.properties.layout], function(err2, results2){
              if(err2){
                deferred.reject(err2);

                done();
              }
              else{
                var layoutPage;

                if(results2.rowCount) {
                  var row = results2.rows[0];
                  layoutPage = row.data;
                  layoutPage.pageId = row.id;
                }

                deferred.resolve({page: page, layoutPage: layoutPage});

                done();
              }
            });
          }
          else{
            deferred.resolve({page: page});

            done();
          }
        }
      });
    });

    return deferred.promise;
  },
  savePage: function(page, siteId){
    var deferred = Q.defer();

    PG.connect(Config.dbConnectionString, function(err, client, done){
      if(err){
        deferred.reject(err);
      }

      var sql, sqlArgs;

      if(page.pageId){
        sql = "update pages set data = $1 where id = $2 and siteId = $3 returning id;";

        sqlArgs = [page, page.pageId, siteId];
      }
      else {
        sql = "insert into pages (data, siteId) values ($1, $2) returning id;";

        sqlArgs = [page, siteId];
      }

      client.query(sql, sqlArgs, function(err, results){
        if(err){
          deferred.reject(err);
        }
        else{
          var id = results.rows[0].id;

          deferred.resolve(id);
        }

        done();
      });
    });

    return deferred.promise;
  },
  deletePage: function(id){
    var deferred = Q.defer();

    PG.connect(Config.dbConnectionString, function(err, client, done) {
      if (err) {
        deferred.reject(err);
      }

      var sql = "delete from pages where id = $1";

      client.query(sql, [id], function(err, results){
        if(err){
          deferred.reject(err);
        }
        else{
          deferred.resolve();
        }

        done();
      });
    });

    return deferred.promise;
  },
  getResources: function(){
    var deferred = Q.defer();

    PG.connect(Config.dbConnectionString, function(err, client, done){
      if(err){
        return deferred.reject(err);
      }

      var sql = "select id, data from resources;";

      client.query(sql, function(err, results){
        if(err){
          deferred.reject(err);
        }
        else{
          var resources = results.rows.map(function(row){
            var resource = row.data;
            resource.id = row.id;

            return resource;
          });

          deferred.resolve(resources);
        }

        done();
      });
    });

    return deferred.promise;
  },
  getResource: function(id){
    var deferred = Q.defer();

    PG.connect(Config.dbConnectionString, function(err, client, done){
      if(err){
        deferred.reject(err);
      }

      var sql = "select id, data from resources where id = $1;";

      client.query(sql, [id], function(err, results){
        if(err){
          deferred.reject(err);
        }
        else{
          var resource;

          if(results.rowCount) {
            resource = results.rows[0].data;
            resource.id = results.rows[0].id;
          }

          deferred.resolve(resource);
        }

        done();
      });
    });

    return deferred.promise;
  },
  saveResource: function(resource){
    var deferred = Q.defer();

    PG.connect(Config.dbConnectionString, function(err, client, done){
      if(err){
        deferred.reject(err);
      }

      var sql, sqlArgs;

      if(resource.id){
        sql = "update resources set data = $1 where id = $2 returning id;";

        sqlArgs = [resource, resource.id];
      }
      else {
        sql = "insert into resources (data) values ($1) returning id;";

        sqlArgs = [resource];
      }

      client.query(sql, sqlArgs, function(err, results){
        if(err){
          deferred.reject(err);
        }
        else{
          var id = results.rows[0].id;

          deferred.resolve(id);
        }

        done();
      });
    });

    return deferred.promise;
  },
  saveResourceData: function(resourceData){
    var deferred = Q.defer();

    PG.connect(Config.dbConnectionString, function(err, client, done) {
      if (err) {
        deferred.reject(err);
      }

      var sql, sqlArgs;

      if(resourceData.id){
        sql = "update resourceData set data = $1, resourceId = $2 where id = $3 returning id;";

        sqlArgs = [resourceData.data, resourceData.resourceId, resourceData.id];
      }
      else {
        sql = "insert into resourceData (data, resourceId) values ($1, $2) returning id;";

        sqlArgs = [resourceData.data, resourceData.resourceId];
      }

      client.query(sql, sqlArgs, function(err, results){
        if(err){
          deferred.reject(err);
        }
        else{
          var id = results.rows[0].id;

          deferred.resolve(id);
        }

        done();
      });
    });

    return deferred.promise;
  },
  getAllResourceData: function(resourceId){
    var deferred = Q.defer();

    PG.connect(Config.dbConnectionString, function(err, client, done){
      if(err){
        deferred.reject(err);
      }

      var sql = "select id, data from resourceData where resourceId = $1 order by id;";

      client.query(sql, [resourceId], function(err, results){
        if(err){
          deferred.reject(err);
        }
        else{
          var allResourceData = [];

          if(results.rowCount) {
            allResourceData = results.rows;
          }

          deferred.resolve(allResourceData);
        }

        done();
      });
    });

    return deferred.promise;
  },
  saveSite: function(site, userId){
    var sql = "insert into sites(data, userId, createdon) values($1, $2, now()) returning id";

    var sqlArgs = [site, userId];

    return executeQuery(sql, sqlArgs, function(results, done, deferred){
      var id = results.rows[0]["id"];

      deferred.resolve(id);

      done();
    });
  },
  getSite: function(id){
    var sql = "select s.id, s.data, array_agg(row_to_json(row(p.id, p.data, p.siteId)::pages) order by p.id) filter (where p.id is not null) as sitePages from sites s left join pages p on s.id = p.siteId where s.id = $1 group by s.id, s.data;";

    var sqlArgs = [id];

    return executeQuery(sql, sqlArgs, function(results, done, deferred){
      var site = results.rows[0]["data"];
      site.id = results.rows[0]["id"];
      site.pages = results.rows[0]["sitepages"];

      deferred.resolve(site);

      done();
    });
  },
  getSites: function(userId){
    var sql = "select id, data from sites where userId = $1 order by id";

    var sqlArgs = [userId]

    return executeQuery(sql, sqlArgs, function(results, done, deferred){
      var sites = results.rows.map(function(row){
        var site = row["data"];
        site.id = row["id"];

        return site;
      });

      deferred.resolve(sites);

      done();
    });
  },
  registerUser: function(registrationForm){
    var sql = "insert into users(email, hashedPassword, createdon) values($1, $2, now())";

    var sqlArgs = [registrationForm.email, registrationForm.hashedPassword];

    return executeQuery(sql, sqlArgs, function(results, done, deferred){
      deferred.resolve();

      done();
    });
  },
  emailInUse: function(email){
    var sql = "select count(email) > 0 as \"emailInUse\" from users where email = $1";

    var sqlArgs = [email];

    return executeQuery(sql, sqlArgs, function(results, done, deferred){
      deferred.resolve(results.rows[0].emailInUse);

      done();
    });
  },
  authenticate: function(credentials){
    var sql = "select count(email) > 0 as \"validCredentails\" from users where email = $1 and hashedpassword = $2";

    var sqlArgs = [credentials.email, credentials.hashedPassword];

    return executeQuery(sql, sqlArgs, function(results, done, deferred){
      deferred.resolve(results.rows[0].validCredentails);

      done();
    });
  },
  transferSites: function(oldUserId, newUserId){
    var sql = "update sites set userId = $1 where userId = $2";

    var sqlArgs = [newUserId, oldUserId];

    return executeQuery(sql, sqlArgs, function(results, done, deferred){
      deferred.resolve();

      done();
    });
  }
};
