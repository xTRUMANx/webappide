var Express = require("express"),
  Router = Express.Router,
  authenticationRoutes = require("./authentication"),
  sitesRoutes = require("./sites"),
  pagesRoutes = require("./pages"),
  resourcesRoutes = require("./resources"),
  resourceDataRoutes = require("./resourceData");

var router = Router();

router.use(function(req, res, next){
  req.session.userId = req.session.userId || req.session.id;

  next();
});

router.use("/authentication", authenticationRoutes);
router.use("/sites", sitesRoutes);
router.use("/pages", pagesRoutes);
router.use("/resources", resourcesRoutes);
router.use("/resourceData", resourceDataRoutes);

module.exports = router;
