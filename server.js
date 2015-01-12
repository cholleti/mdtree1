var Hapi = require("hapi"),
    Mongoose = require("mongoose"),
    server = new Hapi.Server('0.0.0.0', process.env.PORT || 8000),
    mongodbURI = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mdTree',
    routes = require('./routes/main'),
    cookie = require('./routes/config').cookie;
Mongoose.connect(mongodbURI);

var validate = function (decodedToken, callback) {
    if (decodedToken) {
      console.log(decodedToken.username);
    }
    account = [decodedToken.username];
    if (!account) {
      return callback(null, false);
    }
    return callback(null, true, account)
};

server.pack.register(require('hapi-auth-cookie'), function (err) {
    var cache = server.cache('session', { expiresIn: 3 * 24 * 60 * 60 * 1000 }),
        cookieName = cookie.get("cookieName").value,
        cookiePassword = cookie.get("password").value;
    server.app.cache = cache;
    server.auth.strategy('session', 'cookie', {        
        password: cookiePassword,
        cookie: cookieName, 
        // redirectTo: '/',
        isSecure: false,
        validateFunc: function(session, callback) {
            cache.get(session.sid, function(err, cached) {
                if (err) 
                    return callback(err, false);
                if (!cached) 
                    return callback(null, false);
                return callback(null, true, cached.item.account);
            });
        }
    });
    routes.init(server);
});

// server.pack.events.on('request', function(request, event, tags) {
//     console.log(event);
// });
server.ext("onRequest", function(request, next) {
  console.log(request.method, request.path, request.query, request.payload);
  next();
});

server.start(function(err) {
  if (err) {
      console.log("There were some error while starting the Server. Details: " + err);
  }
  console.log("Hapi server started @ " + server.info.uri);
  console.log('server started on port: ', server.info.port);
});