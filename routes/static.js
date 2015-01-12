var Hapi=require("hapi"),
	userRoles = require('../lib/routingConfig').userRoles,
	accessLevels = require('../lib/routingConfig').accessLevels;

module.exports = exports = function(server) {
	exports.homepage(server);
	exports.javascripts(server);
	exports.fonts(server);
	exports.images(server);
	exports.css(server);
	exports.templates(server);
	exports.userimage(server);
	exports.terms(server);
	exports.unknownurl(server);
};

exports.homepage = function(server) {
	server.route({
		method: "GET",
		path: "/",
		config: {
			auth: {
				mode: 'try',
				strategy: "session"
			},
			handler: function(request, reply) {
				var role = userRoles.public, username = '', type = "public", email = '';
				var cookieOptions = {
					encoding: '',
					password: ''
				};

				if (request.auth.credentials) {
					role = request.auth.credentials.role;
					username = request.auth.credentials.username;
				}

				if(request.auth.isAuthenticated)
				{
					username=request.auth.credentials.username;
					role=request.auth.credentials.role;
					type = request.auth.credentials.type;
					email = request.auth.credentials.profile.email;
				}

				Hapi.state.prepareValue(
					'user', 
					encodeURIComponent(JSON.stringify({
						'username': username,
						'role': role,
						'type': type,
						'email': email
					})),
					cookieOptions, 
					function (err, value) {
						if (err) return reply(err);
						reply.state('user', value, { encoding: 'none' } );
					
					}
				);
				reply.file('./public/index.html');
			}
		}
	});
};

exports.templates = function(server) {
	server.route({
		method:"GET",
		path:"/partials/{param*}",
		handler:{
			directory:{
				path:"./public/partials",
				listing:false,
				index:false
			}
		}
	});
};

exports.javascripts = function(server) {
	server.route({
		method: "GET",
		path: "/js/{param*}",
		handler: {
			directory: {
				path: "./public/js",
				listing: false,
				index: false
			}
		}
	});
};

exports.fonts = function(server) {
	server.route({
		method: "GET",
		path: "/fonts/{param*}",
		handler: {
			directory: {
				path: "./public/fonts",
				listing: false,
				index: false
			}
		}
	});
};

exports.images = function(server) {
	server.route({
		method: "GET",
		path: "/images/{param*}",
		handler: {
			directory: {
				path: "./public/images",
				listing: false,
				index: false
			}
		}
	});
};

exports.css = function(server) {
	server.route({
		method: "GET",
		path: "/css/{param*}",
		handler: {
			directory: {
				path: "./public/css",
				listing: false,
				index: false
			}
		}
	});
};

exports.userimage = function(server) {
	server.route({
		method: "GET",
		path: "/userimage/{param*}",
		handler: {
			directory: {
				path: "./userimage",
				listing: false,
				index: false
			}
		}
	});
};

exports.terms = function(server) {
	server.route({
		method: 'GET',
		path: '/terms',
		handler: function(request, reply) {
			reply.file('./public/partials/templates/terms.html');
		}
	});
};


exports.unknownurl = function(server) {
	server.route({
		method:"*",
		path:"/{param*}",
		handler: function(request, reply) {
			reply().redirect("/");
		}
	});
};