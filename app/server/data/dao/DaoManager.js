"use strict";

// Inject
var Exception     = require(global.__server + '/ExceptionManager');
var Logger        = require(global.__server + '/LoggerManager');
var QueriesConfig = require(global.__config + '/queries');

module.exports = function (name_collection) {
	let collection = QueriesConfig[name_collection];

	if(!collection) {
		throw new Error('Collection not found');
	}

	return {

		getQuery (name_fct, name_query, filters) {

			Logger.debug('[DAO - START] DaoManager#getQuery');
			Logger.debug('              -- name_fct   : ' + name_fct);
			Logger.debug('              -- name_query : ' + name_query);
			Logger.debug('              -- filters    : ' + JSON.stringify(filters));

			let output = {};
			try {
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
			} catch (err) {
				Logger.debug('[DAO - CATCH] DaoManager#getQuery');
				Logger.error('              -- message : ' + err.message);

				throw err;
			}

			Logger.debug('[DAO -   END] DaoManager#getQuery');
			Logger.debug('              -- output   : ' + JSON.stringify(output));

			return output;
		}
	};
};