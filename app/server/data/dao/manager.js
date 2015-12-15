"use strict";

// Inject
var path      = require('path');
var BPromise  = require('bluebird');
var queries   = require(path.join(global.__config, 'queries'));
var Exception = require(path.join(global.__core, 'exception'));
var logger    = require(path.join(global.__core, 'logger'))('dao', __filename);

module.exports = function (name_collection) {

	let collection = queries[name_collection];
	if(!collection) {
		throw new Error('Collection not found');
	}

	return {

		getQuery : BPromise.method(function (name_fct, name_query, filters) {

			logger.debug({ method : 'getQuery', point : logger.pt.start, params : {
				name_fct   : name_fct,
				name_query : name_query,
				filters    : filters
			} });

			let output = {};
			if(!name_fct || !name_query || !filters) {
			 	throw new Error('Bad query : element missing');
			}

			let queries = collection[name_fct];
			if(!queries) {
				throw new Error('No fonction found');
			}

			let params  = queries[name_query];
			if(!params) {
				throw new Error('No query found');
			}

			Object.keys(params).map(function(key) {
				var param = params[key];
				var value = filters[key];

				if(typeof param === 'string') {
					if(value !== undefined) {
						output[param] = value;
					} else {
				 		throw new Exception.ParamEx('Value missing for "' + param + '"');
					}
				} else {

					// Else JSON obj
					if(!param.field) {
						throw new Error('Bad query : "field" missing');
					}

					let options = {
						field    : param.field,
						op       : param.op || undefined,
						default  : param.default ||undefined,
						required : param.required || true
					};

					if( value !== undefined && options.op) {
						let sel = {};
						sel[options.op] = value;

						// Value by default
						output[options.field] = sel;

					} else if(value !== undefined) {
						// Value filtered
						output[options.field] = value;

					} else if(options.default) {
						// Value by default
						output[options.field] = options.default;

					} else if(options.required) {
						throw new Exception.ParamEx('Value missing for "' + param.field + '"');
					}
				}
			});

			logger.debug({ method : 'getQuery', point : logger.pt.end, params : {
				output : output
			} });

			return output;
		})
	};
};