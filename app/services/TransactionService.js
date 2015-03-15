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

		// Validate category id
		CategoryModel.findById(req.body.category_id, '_id', function (err, category) {
			if (err) {
				return res.json(responseService.fail('Add failed', err.message));
			}
			if (!category) {
				return res.json(responseService.fail('Add failed', 'Category id invalid'));
			}

			var transaction = new TransactionModel();

			// Build object
			transaction.day = req.body.date;
			transaction.sum = req.body.sum;
			if (req.body.comment) {
				transaction.comment = req.body.comment;
			}
			transaction._user = req.decoded.id;

			var date_split = req.body.date.split('/');
			var mm = date_split[1];
			var yy = date_split[2];

			var promise = PlanModel.findOne({
				_user : transaction._user,
				month : mm,
				year  : yy
			}).populate('programs', '_id category').exec();

			promise.then(function (plan) {

				if (!plan) {
					throw new Error('Plan not exist');
				}

				return ProgramModel.findOne({
					_id      : { $in : plan.programs },
					category : req.body.category_id
				}).exec();

			}).then(function (program) {

				if (!program) {
					throw new Error('Program not exist');
				}

				transaction._program = program._id;

				transaction.save(function (err) {
					if (!err) {
						return res.json(responseService.fail('Add failed', err.message));
					}

					transaction.addLinkProgram();

					return res.json(responseService.success('Add success', transaction._id));
				});
			});
		});
	},

	// Update one transaction
	update             : function (req, res) {

		// Query find transaction by id and user
		TransactionModel.findOne({
			_id   : req.params.transaction_id,
			_user : req.decoded.id
		}).populate('_program', 'category').exec(
			function (err, transaction) {
				if (err) {
					return res.json(responseService.fail('Update failed', err.message));
				}
				if (!transaction) {
					return res.json(responseService.fail('Update failed', 'Transaction not found'));
				}

				var last_transaction = transaction;

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

					try {
						// Validate category id
						CategoryModel.findById(req.body.category_id, '_id', function (err, category) {
							if (err) {
								throw err;
							}
							if (!category) {
								throw new Error('Category id invalid');
							}
						});

						// TODO
					} catch (err) {
						return res.json(responseService.fail('Update failed', err.message));
					}
				}

				// Query save
				transaction.save(function (err) {
					if (err) {
						return res.json(responseService.fail('Update failed', err.message));
					}

					try {
						removeTransactionToParentProgram(last_transaction);
						addTransactionToParentProgram(transaction);
					} catch (err) {
						return res.json(responseService.fail('Update failed', err.message));
					}

					return res.json(responseService.success('Update success'));
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

			try {
				removeTransactionToParentProgram(transaction);
			} catch (err) {
				return res.json(responseService.fail('Remove failed', err.message));
			}

			return res.json(responseService.success('Remove success'));
		});
	},

	// Get transactions by type category
	allByTypeCategoryU : function (req, res) {

		// Query find transactions by user and type category
		TransactionModel.find({
			_user : req.decoded.id
		}).populate('_program', 'category').populate('_program.category', 'type').where('_program.category.type')
			.equals(req.params.type_category_id).exec(function (err, transactions) {
				if (err) {
					return res.json(responseService.fail('Find failed', err.message));
				}
				return res.json(responseService.success('Find success', transactions));
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