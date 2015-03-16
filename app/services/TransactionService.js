// Inject models
var PlanModel = require(global.__model + '/PlanModel');
var ProgramModel = require(global.__model + '/ProgramModel');
var TransactionModel = require(global.__model + '/TransactionModel');
var CategoryModel = require(global.__model + '/CategoryModel');

// Inject services
var responseService = require(global.__service + '/ResponseService');

module.exports = {

	// Create one transaction
	create             : function (req, res) {

		var promise = CategoryModel.findOne({
			_id   : req.body.category_id,
			_user : req.decoded.id
		}).exec();

		promise.then(function (category) {

			if (!category) {
				return res.json(responseService.fail('Add failed', 'Category not found'));
			}

			var date_split = req.body.date.split('/');

			return PlanModel.findOne({
				_user : req.decoded.id,
				month : date_split[1],
				year  : date_split[2]
			}).populate('programs', '_id category').exec();

		}).then(function (plan) {

			if (!plan) {
				return res.json(responseService.fail('Add failed', 'Plan not found'));
			}

			return ProgramModel.findOne({
				_plan    : plan._id,
				category : req.body.category_id
			}).exec();

		}).then(function (program) {

			if (!program) {
				return res.json(responseService.fail('Add failed', 'Program not found'));
			}

			var transaction = new TransactionModel();

			// Build object
			transaction.day = req.body.date;
			transaction.sum = req.body.sum;
			if (req.body.comment) {
				transaction.comment = req.body.comment;
			}
			transaction._user = req.decoded.id;
			transaction._program = program._id;

			transaction.save(function (err) {
				if (err) {
					return res.json(responseService.fail('Add failed', err.message));
				}

				transaction.addLinkProgram();

				return res.json(responseService.success('Add success', transaction._id));
			});
		});
	},

	// Update one transaction
	update             : function (req, res) {

		var promise = TransactionModel.findOne({
			_id   : req.params.transaction_id,
			_user : req.decoded.id
		}).populate('_program', 'category').exec();

		promise.then(function (transaction) {

			if (!transaction) {
				return res.json(responseService.fail('Update failed', 'Transaction not found'));
			}

			// Build object
			if (!req.body.date.equals(transaction.date)) {
				transaction.date = req.body.date;
			}
			if (req.body.sum) {
				transaction.sum = req.body.sum;
			}
			if (req.body.comment) {
				transaction.comment = req.body.comment;
			}
			if (!req.body.category_id.equals(transaction._program.category) ||
				!req.body.date.equals(transaction.date)) {
				transaction.removeLinkProgram();
			}

			// Query save
			transaction.save(function (err) {
				if (err) {
					return res.json(responseService.fail('Update failed', err.message));
				}

				if (transaction.isModified('_program')) {

					promise = CategoryModel.findOne({
						_id   : req.body.category_id,
						_user : req.decoded.id
					}).exec();

					promise.then(function (category) {

						if (!category) {
							return res.json(responseService.success('Update success but no link program'));
						}

						var date_split = req.body.date.split('/');

						return PlanModel.findOne({
							_user : req.decoded.id,
							month : date_split[1],
							year  : date_split[2]
						}).populate('programs', '_id category').exec();

					}).then(function (plan) {

						if (!plan) {
							return res.json(responseService.success('Update success but no link program'));
						}

						return ProgramModel.findOne({
							_plan    : plan._id,
							category : req.body.category_id
						}).exec();

					}).then(function (program) {

						if (!program) {
							return res.json(responseService.success('Update success but no link program'));
						}

						transaction.save().exec();

						return res.json(responseService.success('Update success'));
					});
				}
			});
		});
	},

	// Remove one transaction
	remove             : function (req, res) {

		// Query remove
		TransactionModel.findOneAndRemove({
			_id   : req.params.transaction_id,
			_user : req.decoded.id
		}, function (err, transaction) {
			if (err) {
				return res.json(responseService.fail('Remove failed', err.message));
			}
			if (!transaction) {
				return res.json(responseService.fail('Remove failed', 'Transaction not found'));
			}

			transaction.removeLinkProgram();

			return res.json(responseService.success('Remove success'));
		});
	},

	// Get transactions by type category
	allByTypeCategoryU : function (req, res) {

		// Query find transactions by user and type category
		CategoryModel
			.find({ type : req.params.type_category_id })
			.populate('_programs', 'transactions')
			.exec(function (err, categories) {
				if (err) {
					return res.json(responseService.fail('Find failed', err.message));
				}
				if (!categories) {
					return res.json(responseService.fail('Find failed', 'Transaction not found'));
				}

				categories.forEach(function (category) {
					category._programs.forEach(function (program) {

						program.populate('transactions', function (err, programEnrichy) {
							if (err) {
								return res.json(responseService.fail('Find failed', err.message));
							}
							if (!programEnrichy || !programEnrichy.transactions) {
								return res.json(responseService.fail('Find failed', 'Transaction not found'));
							}
							console.log('each ------------------------');
							console.log(programEnrichy.transactions);
							console.log('-----------------------------');
						});
					});
				});
				return res.json(responseService.success('Find success'));
			});
	},

	// Get transactions by program
	allByProgramU      : function (req, res) {

		// Query find transactions by user and type category
		TransactionModel.find({
			_user    : req.decoded.id,
			_program : req.params.program_id
		}, function (err, transactions) {
			if (err) {
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', transactions));
		});
	},

	// Get one transaction by id
	getByIdU           : function (req, res) {

		// Query find transaction by id and user
		TransactionModel.findOne({
			_id   : req.params.transaction_id,
			_user : req.decoded.id
		}, function (err, transaction) {
			if (err) {
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', transaction));
		});
	}
};