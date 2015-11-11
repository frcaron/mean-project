// Inject
var ResponseService = require(global.__service + '/ResponseService');
var TypeCategoryDao = require(global.__dao + '/TypeCategoryDao');

module.exports = {

	// Create one type category
	create    : function (req, res) {

		var input = req.body;

		TypeCategoryDao.create(input)
			.then(function (typeCategory){
				ResponseService.success(res, 'Add success', typeCategory);
			})
			.catch(function (err){
				ResponseService.fail(res, 'Add failed', err.message);
			});
	},

	// Update one type category
	update    : function (req, res) {

		var input = req.body;

		TypeCategoryDao.update(input)
			.then(function (typeCategory) {
				ResponseService.success(res, 'Update success', typeCategory);
			})
			.catch(function (err) {
				ResponseService.fail(res, 'Update failed', err.message);
			});
	},

	// Get all type category
	all       : function (req, res) {

		TypeCategoryDao.getAll()
			.then(function (typeCategories) {
				ResponseService.success(res, 'Find success', typeCategories);
			})
			.catch(function (err) {
				ResponseService.fail(res, 'Find failed', err.message);
			});
	},

	// Get all type category active
	allActive : function (req, res) {

		var filters = {
			active : true
		};

		TypeCategoryDao.getAll(filters)
			.then(function (typeCategories) {
				ResponseService.success(res, 'Find success', typeCategories);
			})
			.catch(function (err) {
				ResponseService.fail(res, 'Find failed', err.message);
			});
	},

	// Get one type category by id
	getById    : function (req, res) {

		var filters = {
			id : req.params.type_category_id
		};

		TypeCategoryDao.getOne(filters)
			.then(function (typeCategory) {
				ResponseService.success(res, 'Find success', typeCategory);
			})

			.catch(function (err) {
				ResponseService.fail(res, 'Find failed', err.message);
			});
	}
};