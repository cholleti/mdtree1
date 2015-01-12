exports.init = function(server) {
  require("./static")(server);
  require("./auth")(server);
  require("./searchProvider")(server);
  require("./timeschedule")(server);
  require("./updateauth")(server);
  require("./provider")(server);
  require("./patient")(server);
  require("./hitAnalysis")(server);
};