var Gulp = require("gulp"),
  GulpReact = require("gulp-react"),
  GulpRename = require("gulp-rename"),
  GulpBrowserify = require("gulp-browserify"),
  GulpNotify = require("gulp-notify")

Gulp.task("jsx-transform", function(cb){
  var stream = Gulp.src("./*.jsx").
    pipe(GulpReact()).
    on("error", GulpNotify.onError(function(err){
      console.log(err);

      return "Reactification Failed!";
    })).
    pipe(GulpRename(function(path){
      path.extname = ".js";
    })).
    pipe(Gulp.dest("./"));

  stream.on("finish", function(){
    cb();
  });
});

Gulp.task("watch", ["jsx-transform"], function(){
  Gulp.watch("./*.jsx", ["jsx-transform"]);
});

Gulp.task("default", ["watch"]);
