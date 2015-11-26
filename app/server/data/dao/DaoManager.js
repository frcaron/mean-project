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

		getFilters (name_fct, name_query, filters) {

			Logger.debug('[DAO - START] DaoManager#getFilters');
			Logger.debug('              -- name_fct   : ' + name_fct);
			Logger.debug('              -- name_query : ' + name_query);
			Logger.debug('              -- filters    : ' + JSON.stringify(filters));

			let output  = {};
			try {
				if(!name_fct || !name_query || !filters) {
				 	throw new Exception.ParamEx('Bad query');
				}

				let queries = collection[name_fct];
				if(!queries) {
					throw new Exception.ParamEx('No fonction found');
				}

				let params  = queries[name_query];
				if(!params) {
					throw new Exception.ParamEx('No query found');
				}

				Object.keys(params).map(function(key) {
					var param = params[key];
					var value = filters[key];

					if(value instanceof String) {
						if(value) {
							output[param] = value;
						} else {
					 		throw new Exception.ParamEx('Param missing');
						}
					} else if(value instanceof JSON) { // TODO is JSON

					} else {
						throw new Error('Queries malformed');
					}
				});
			} catch (err) {
				Logger.debug('[DAO - CATCH] DaoManager#getFilters');
				Logger.error('              -- message : ' + err.message);

				throw err;
			}

			Logger.debug('[DAO -   END] DaoManager#getFilters');
			Logger.debug('              -- output   : ' + output);

			return output;
		}
	};
};