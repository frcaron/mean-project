// Inject application
var Promise = require('bluebird');

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
                return responseService.fail(res, 'Add failed', 'Category not found');
            }

            var date_split = req.body.date.split('/');

            return PlanModel.findOne({
                _user : req.decoded.id,
                month : date_split[ 1 ],
                year  : date_split[ 2 ]
            }).populate('programs', '_id category').exec();

        }).then(function (plan) {

            if (!plan) {
                return responseService.fail(res, 'Add failed', 'Plan not found');
            }

            return ProgramModel.findOne({
                _plan    : plan._id,
                category : req.body.category_id
            }).exec();

        }).then(function (program) {

            if (!program) {
                return responseService.fail(res, 'Add failed', 'Program not found');
            }

            var transaction = new TransactionModel();

            // Build object
            transaction.date = req.body.date;
            transaction.sum = req.body.sum;
            if (req.body.comment) {
                transaction.comment = req.body.comment;
            }
            transaction._user = req.decoded.id;
            transaction._program = program._id;

            transaction.save(function (err) {
                if (err) {
                    return responseService.fail(res, 'Add failed', err.message);
                }

                transaction.addLinkProgram();

                return responseService.success(res, 'Add success', transaction._id);
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
                return responseService.fail(res, 'Update failed', 'Transaction not found');
            }

            var last_category = transaction._program.category;

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
                    return responseService.fail(res, 'Update failed', err.message);
                }

                if (transaction.isModified('_program')) {

                    promise = CategoryModel.findOne({
                        _id   : req.body.category_id,
                        _user : req.decoded.id
                    }).exec();

                    promise.then(function (category) {

                        if (!category) {
                            return responseService.success(res, 'Update success but no link program');
                        }

                        var date_split = req.body.date.split('/');

                        return PlanModel.findOne({
                            _user : req.decoded.id,
                            month : date_split[ 1 ],
                            year  : date_split[ 2 ]
                        }).populate('programs', '_id category').exec();

                    }).then(function (plan) {

                        if (!plan) {
                            return responseService.success(res, 'Update success but no link program');
                        }

                        return ProgramModel.findOne({
                            _plan    : plan._id,
                            category : req.body.category_id
                        }).exec();

                    }).then(function (program) {

                        if (!program) {
                            return responseService.success(res, 'Update success but no link program');
                        }

                        transaction.save();

                        return responseService.success(res, 'Update success');
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
                return responseService.fail(res, 'Remove failed', err.message);
            }
            if (!transaction) {
                return responseService.fail(res, 'Remove failed', 'Transaction not found');
            }

            transaction.removeLinkProgram();

            return responseService.success(res, 'Remove success');
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
                    return responseService.fail(res, 'Find failed', err.message);
                }
                if (!categories) {
                    return responseService.fail(res, 'Find failed', 'Transaction not found');
                }

                var result = [];
                categories.map(function (category) {
                    category._programs.map(function (program) {
                        program.transactions.map(function (transaction) {
                            result.push(transaction);
                        });
                    });
                });

                Promise.all(result).then(function (transactions) {
                    TransactionModel.find({ _id : { $in : transactions } }, function (err, t) {
                        if (err) {
                            return responseService.fail(res, 'Find failed', err.message);
                        }
                        if (!t) {
                            return responseService.fail(res, 'Find failed', 'Transaction not found');
                        }
                        return responseService.success(res, 'Find success', t);
                    });
                });
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
                return responseService.fail(res, 'Find failed', err.message);
            }
            return responseService.success(res, 'Find success', transactions);
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
                return responseService.fail(res, 'Find failed', err.message);
            }
            return responseService.success(res, 'Find success', transaction);
        });
    }
};