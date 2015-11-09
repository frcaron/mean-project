// Inject applicatif
var Bcrypt              = require('bcrypt-nodejs');
var Jwt                 = require('jsonwebtoken');
var Express             = require('express');
var Bluebird            = require('bluebird');
var Mongoose            = Bluebird.promisifyAll(require('mongoose'));

// Inject Config
var TokenConfig         = require(global.__config + '/token');

// Inject Services
var UserService         = require(global.__service + '/UserService');
var PlanService         = require(global.__service + '/PlanService');
var ProgramService      = require(global.__service + '/ProgramService');
var CategoryService     = require(global.__service + '/CategoryService');
var TransactionService  = require(global.__service + '/TransactionService');
var TypeCategoryService = require(global.__service + '/TypeCategoryService');
var ResponseService     = require(global.__service + '/ResponseService');
var SessionService      = require(global.__service + '/SessionService');

// Inject DAO
var UserDao             = require(global.__dao + '/UserDao');
var PlanDao             = require(global.__dao + '/PlanDao');
var ProgramDao          = require(global.__dao + '/ProgramDao');
var CategoryDao         = require(global.__dao + '/CategoryDao');
var TransactionDao      = require(global.__dao + '/TransactionDao');
var TypeCategoryDao     = require(global.__dao + '/TypeCategoryDao');

// Inject Models
var UserModel           = require(global.__model + '/UserModel');
var PlanModel           = require(global.__model + '/PlanModel');
var ProgramModel        = require(global.__model + '/ProgramModel');
var CategoryModel       = require(global.__model + '/CategoryModel');
var TransactionModel    = require(global.__model + '/TransactionModel');
var TypeCategoryModel   = require(global.__model + '/TypeCategoryModel');
var CountersModel       = require(global.__model + '/CountersModel');

// Inject Plugins
var DatePlugin          = require(global.__plugin + '/DatePlugin');
var UserPlugin          = require(global.__plugin + '/UserPlugin');

module.exports = {
	
	app      : {
		bcrypt   : Bcrypt,
		jwt      : Jwt,
		express  : Express,
		bluebird : Bluebird,
		mongoose : Mongoose
	},

	config   : {
		tokenConfig : TokenConfig
	},

	services : {
		userService         : UserService,
		planService         : PlanService,
		programService      : ProgramService,
		categoryService     : CategoryService,
		transactionService  : TransactionService,
		typeCategoryService : TypeCategoryService,
		responseService     : ResponseService,
		sessionService      : SessionService,
		tokenConfig         : TokenConfig
	},

	dao      : {
		userDao         : UserDao,
		planDao         : PlanDao,
		programDao      : ProgramDao,
		categoryDao     : CategoryDao,
		transactionDao  : TransactionDao,
		typeCategoryDao : TypeCategoryDao
	},

	models   : {
		userModel         : UserModel,
		planModel         : PlanModel,
		programModel      : ProgramModel,
		categoryModel     : CategoryModel,
		transactionModel  : TransactionModel,
		typeCategoryModel : TypeCategoryModel,
		countersModel     : CountersModel
	},

	plugins  : {
		datePlugin : DatePlugin,
		userPlugin : UserPlugin
	},
}