var PG = require("pg"),
  Q = require("q");

var Config = require("./config");

module.exports = {
  getPages: function(){
    var deferred = Q.defer();

    PG.connect(Config.dbConnectionString, function (err, client, done) {
      if(err){
        deferred.reject(err);
      }

      var sql = "select id, data from pages";

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

      client.query(sql, [id], function(err, result){
        if(err){
          deferred.reject(err);
        }
        else{
          var page;

          if(result.rowCount) {
            var row = result.rows[0];
            page = row.data;
            page.pageId = row.id;
          }

          deferred.resolve(page);
        }

        done();
      });
    });

    return deferred.promise;
  },
  savePage: function(page){
    var deferred = Q.defer();

    PG.connect(Config.dbConnectionString, function(err, client, done){
      if(err){
        deferred.reject(err);
      }

      var sql, sqlArgs;

      if(page.pageId){
        sql = "update pages set data = $1 where id = $2 returning id;";

        sqlArgs = [page, page.pageId];
      }
      else {
        sql = "insert into pages (data) values ($1) returning id;";

        sqlArgs = [page];
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
  }
};
