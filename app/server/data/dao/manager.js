"use strict";

// Inject
var Path      = require('path');
var BPromise  = require('bluebird');
var Queries   = require(Path.join(global.__config, 'queries'));
var Exception = require(Path.join(global.__core, 'exception'));
var Logger    = require(Path.join(global.__core, 'system')).Logger;

module.exports = function (name_collection) {
	let collection = Queries[name_collection];

	if(!collection) {
		throw new Error('Collection not found');
	}

	return {

		getQuery : BPromise.method(function (name_fct, name_query, filters) {

			Logger.debug('[DAO - START] DaoManager#getQuery');
			Logger.debug('              -- name_fct   : ' + name_fct);
			Logger.debug('              -- name_query : ' + name_query);
			Logger.debug('              -- filters    : ' + JSON.stringify(filters));

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

			Logger.debug('[DAO -   END] DaoManager#getQuery');
			Logger.debug('              -- output   : ' + JSON.stringify(output));

			return output;
		})
	};
};