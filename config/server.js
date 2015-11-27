"use strict";

let hostname = process.env.HOSTNAME || 'localhost';
let port     = process.env.PORT || 3000;

module.exports = {
	domain   : process.env.ENV === 'production' ? process.env.DOMAIN : ('http://' + hostname + ':' + port),
	hostname : hostname,
	port     : port
};