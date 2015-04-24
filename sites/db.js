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
      return deferred.reject(err);
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

function executeQueries(queries){
  var deferred = Q.defer();
  var queryIndex = 0;

  PG.connect(Config.dbConnectionString, function(err, client, done){
    if(err){
      return deferred.reject(err);
    }

    client.query("BEGIN", function(err, results){
      if(err){
        deferred.reject(err);

        done();
      }
      else{
        var query = queries[queryIndex]();

        runNextQuery(query);
      }
    });

    function runNextQuery(query){
      client.query(query.sql, query.sqlArgs, function(err, results){
        if(err){
          client.query("ROLLBACK", function(rollbackErr){
            deferred.reject([err, rollbackErr]);

            done();
          });
        }
        else{
          query.cb(results, next);
        }
      });
    }

    function next(result){
      queryIndex++;

      if(queryIndex < queries.length){
        var query = queries[queryIndex](result);

        runNextQuery(query);
      }
      else{
        client.query("COMMIT", function(err){
          if(err){
            deferred.reject(err);
          }
          else{
            deferred.resolve(result);
          }

          done();
        })
      }
    }
  });

  return deferred.promise;
}

module.exports = {
  getDeployedPages: function(){
    var deferred = Q.defer();

    PG.connect(Config.dbConnectionString, function (err, client, done) {
      if(err){
        deferred.reject(err);
      }

      var sql = "select pageid, data from deployedpages order by pageid";

      client.query(sql, function(err, result){
        if(err){
          deferred.reject(err);
        }
        else{
          var pages = result.rows.map(function(row){
            var page = row.data;
            page.pageId = row.pageid;

            return page;
          });

          deferred.resolve(pages);
        }

        done();
      });
    });

    return deferred.promise;
  },
  getDeployedLayoutPages: function(){
    var deferred = Q.defer();

    PG.connect(Config.dbConnectionString, function (err, client, done) {
      if(err){
        deferred.reject(err);
      }

      var sql = "select pageid, data from deployedpages where data ? 'contentElement'";

      client.query(sql, function(err, result){
        if(err){
          deferred.reject(err);
        }
        else{
          var pages = result.rows.map(function(row){
            var page = row.data;
            page.pageId = row.pageid;

            return page;
          });

          deferred.resolve(pages);
        }

        done();
      });
    });

    return deferred.promise;
  },
  getDeployedPage: function(id, siteId){
    var deferred = Q.defer();

    PG.connect(Config.dbConnectionString, function (err, client, done) {
      if(err){
        deferred.reject(err);
      }

      var sql = "select pageid, data from deployedpages where pageid = $1 and siteid = $2 and deploymentid = (select max(id) from deployments where siteid = $2)";

      client.query(sql, [id, siteId], function(err, results){
        if(err){
          deferred.reject(err);

          done();
        }
        else{
          var page;

          if(results.rowCount) {
            var row = results.rows[0];
            page = row.data;
            page.pageId = row.pageid;
          }
          else{
            deferred.resolve({page: page});

            return done();
          }

          if(page.properties.layout){
            client.query("select pageid, data from deployedpages where pageid = $1 and siteId = $2", [page.properties.layout, siteId], function(err2, results2){
              if(err2){
                deferred.reject(err2);

                done();
              }
              else{
                var layoutPage;

                if(results2.rowCount) {
                  var row = results2.rows[0];
                  layoutPage = row.data;
                  layoutPage.pageId = row.pageid;
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
  getHomePageId: function(siteId){
    var sql = "select pageid from deployedpages where siteid = $1 and homepage = TRUE and deploymentid = (select max(id) from deployments where siteid = $1)";

    var sqlArgs = [siteId];

    return executeQuery(sql, sqlArgs, function(results, done, deferred){
      var pageId;
      console.log(results.rowCount, results.rows)
      if(results.rowCount){
        pageId = results.rows[0]["pageid"];
      }

      deferred.resolve(pageId);

      done();
    });
  }
};
