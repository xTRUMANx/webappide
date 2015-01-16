var Gulp = require("gulp"),
  GulpReact = require("gulp-react"),
  GulpRename = require("gulp-rename"),
  GulpBrowserify = require("gulp-browserify");

Gulp.task("jsx-transform", function(cb){
  var stream = Gulp.src("./ui/**/*").
    pipe(GulpReact()).
    on("error", function(err){
      console.log(err);

      this.end();
    }).
    pipe(GulpRename(function(path){
      path.extname = ".js";
    })).
    pipe(Gulp.dest("./ui-transformed"));

  stream.on("finish", function(){
    cb();
  });
});

Gulp.task("bundle", ["jsx-transform"], function(){
  Gulp.src("./ui-transformed/index.js").
    pipe(GulpBrowserify()).
    pipe(GulpRename("bundle.js")).
    pipe(Gulp.dest("./public/js/"));
});

Gulp.task("watch", ["bundle"], function(){
  Gulp.watch("./ui/**/*", ["bundle"]);
});

Gulp.task("default", ["watch"]);