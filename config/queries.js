// Authorise [query - params] by fonction and collection
// Left param to match, right param model
module.exports = {

    // ===============================================================
    // User queries ==================================================
    // ===============================================================

	'user'          : {

		// All get one object queries
		'getOne' : {

			// By id
			'byId' : {
				'user_id' : '_id'
			},

			// By email
			'byEmail' : {
				'local_email' : 'local.email'
			},

			// By facebook id
			'byFbId' : {
				'facebook_id' : 'facebook.id'
			}
		}
	},

    // ===============================================================
    // Plan queries ==================================================
    // ===============================================================

	'plan'          : {

		// All remove queries
		'remove' : {

			// By id and user
			'byIdU' : {
				'plan_id' : '_id',
				'user_id' : '_user'
			},

			// By user
			'byU' : {
				'user_id' : '_user'
			}
		},

		// All get several object queries
		'getAll' : {

			// By user
			'byU' : {
				'user_id' : '_user'
			}
		},

		// All get one object queries
		'getOne' : {

			// By id and user
			'byIdU'        : {
				'plan_id' : '_id',
				'user_id' : '_user'
			},

			// By month, year and user
			'byMonthYearU' : {
				'month'   : 'month',
				'year'    : 'year',
				'user_id' : '_user'
			}
		}
	},

    // ===============================================================
    // Programs queries ==============================================
    // ===============================================================

	'program'       : {

		// All remove queries
		'remove' : {

			// By id and user
			'byIdU'   : {
				'program_id' : '_id',
				'user_id'    : '_user'
			},

			// By plan and user
			'byPlanU' : {
				'plan_id'    : '_plan',
				'user_id'    : '_user'
			},

			// By user
			'byU'     : {
				'user_id'    : '_user'
			}
		},

		// All get several object queries
		'getAll' : {

			// In list categories given by plan and user
			'inCategoriesbyPlanU' : {
				'categories_id' : {
					field : '_category',
					op    : '$in'
				},
				'plan_id'       : '_plan',
				'user_id'       : '_user'
			},

			// In list categories given by user
			'inCategoriesByU' : {
				'categories_id' : {
					field : '_category',
					op    : '$in'
				},
				'user_id'       : '_user'
			},

			// By plan and user
			'byPlanU' : {
				'plan_id' : '_plan',
				'user_id' : '_user'
			}
		},

		// All get one object queries
		'getOne' : {

			// By id and user
			'byIdU' : {
				'program_id' : '_id',
				'user_id'    : '_user'
			},

			// By category, plan and user
			'byCategoryPlanU' : {
				'category_id' : '_category',
				'plan_id'     : '_plan',
				'user_id'     : '_user'
			}
		}
	},

    // ===============================================================
    // Category queries ==============================================
    // ===============================================================

	'category'      : {

		// All remove queries
		'remove' : {

			// By id and user
			'byIdU' : {
				'category_id' : '_id',
				'user_id'     : '_user'
			},

			// By user
			'byU' : {
				'user_id' : '_user'
			}
		},

		// All get several object queries
		'getAll' : {

			// Not in categories given by type and user
			'ninCategoryiesByTypeU' : {
				'categories_id'    : {
					field : '_id',
					op    : '$nin'
				},
				'type_category_id' : '_type',
				'active'           : {
					field   : 'active',
					default : true
				},
				'neutre'           : {
					field    : 'neutre',
					required : false
				},
				'user_id'          : '_user'
			},

			// By type and user
			'byTypeU' : {
				'type_category_id' : '_type',
				'active'           : {
					field   : 'active',
					default : true
				},
				'user_id'          : '_user'
			},

			// By neutre and user
			'byNeutreU' : {
				'active'  : {
					field   : 'active',
					default : true
				},
				'neutre'  : 'neutre',
				'user_id' : '_user'
			},

			// By user
			'byU' : {
				'active'  : {
					field   : 'active',
					default : true
				},
				'user_id' : '_user'
			}
		},

		// All get one object queries
		'getOne' : {

			// By id and user
			'byIdU'        : {
				'category_id' : '_id',
				'user_id'     : '_user'
			},

			// By neutre, type category and user
			'byNeutreTypeU' : {
				'active'            : {
					field   : 'active',
					default : true
				},
				'neutre'            : {
					field   : 'neutre'
				},
				'type_category_id' : '_type',
				'user_id'          : '_user'
			},

			// By neutre and user
			'byNeutreU' : {
				'active'  : {
					field   : 'active',
					default : true
				},
				'neutre'  : {
					field   : 'neutre'
				},
				'user_id' : '_user'
			},

			// By name, type category and user
			'byNameTypeU' : {
				'name'             : 'name',
				'type_category_id' : '_type',
				'user_id'          : '_user'
			}
		}
	},

    // ===============================================================
    // Transaction queries ===========================================
    // ===============================================================

	'transaction'   : {

		// All update queries
		'update' : {

			// By program and user
			'byProgramU' : {
				'program_id' : '_program',
				'user_id'    : '_user'
			}
		},

		// All remove queries
		'remove' : {

			// By id and user
			'byIdU' : {
				'transaction_id' : '_id',
				'user_id'        : '_user'
			},

			// By plan and user
			'byPlanU' : {
				'plan_id' : '_plan',
				'user_id' : '_user'
			},

			// By user
			'byU' : {
				'user_id' : '_user'
			}
		},

		// All get several object queries
		'getAll' : {

			// In list programs given by user
			'byProgramsU' : {
				'programs_id' : {
					field : '_program',
					op    : '$in'
				},
				'user_id'     : '_user'
			},

			// By user
			'byU' : {
				'user_id' : '_user'
			}
		},

		// All get one object queries
		'getOne' : {

			// By id and user
			'byIdU'        : {
				'transaction_id' : '_id',
				'user_id'        : '_user'
			}
		}
	},

    // ===============================================================
    // Type category queries =========================================
    // ===============================================================

	'type_category' : {

		// All get one object queries
		'getOne' : {

			// By id
			'byId' : {
				'type_category_id' : '_id'
			}
		}
	}
};