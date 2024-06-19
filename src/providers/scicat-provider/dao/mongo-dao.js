"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoConnector = void 0;
var bluebird_1 = require("bluebird");
var mongodb_1 = require("mongodb");
var env_1 = require("../../../server/env");
var logger_1 = require("../../../server/logger");
/**
 * This is the DAO service for Scicat. It uses a mongo connection
 * to retrieve data.  Database connection parameters are
 * provided by the credentials file (path defined in .env).
 */
var MongoConnector = /** @class */ (function () {
    function MongoConnector() {
        var _this = this;
        logger_1.default.debug("Setting up the mongo connection.");
        var user_url = process.env.DB_USER ? process.env.DB_USER + (process.env.DB_PASS ? ":" + process.env.DB_PASS : "") + "@" : "";
        var db_url = process.env.DATABASE ? "/" + process.env.DATABASE : "";
        var url = process.env.DB_URL || (user_url + process.env.DB_HOST + ":" + process.env.DB_PORT + db_url);
        this.dbName = process.env.DATABASE;
        this.collectionName = process.env.COLLECTION;
        this.mongoDb = new mongodb_1.MongoClient("mongodb://" + url);
        this.mongoDb.connect()
            .then(function (client) {
            _this.db = client.db(_this.dbName);
            logger_1.default.debug("Client successfully connected.");
        }).catch(function (error) {
            logger_1.default.error("Failes to connect");
            _this.db = null;
        });
    }
    MongoConnector.getInstance = function () {
        try {
            if (this.instance) {
                return this.instance;
            }
            this.instance = new MongoConnector();
            return this.instance;
        }
        catch (err) {
            throw new Error("Failed to get MongoConnector instance: " + err.message);
        }
    };
    /**
     * Responds to OAI ListRecords requests.
     * @param parameters
     * @returns {Promise<any>}
     */
    MongoConnector.prototype.recordsQuery = function (parameters, filter) {
        if (!this.db) {
            (0, bluebird_1.reject)("no db connection");
        }
        var Publication = this.db.collection(this.collectionName);
        return new Promise(function (resolve, reject) {
            Publication.find(filter).toArray(function (err, items) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(items);
                }
            });
        });
    };
    /**
     * Responds to OAI ListIdentifiers requests.
     * @param parameters
     * @returns {Promise<any>}
     */
    MongoConnector.prototype.identifiersQuery = function (parameters, filter) {
        if (!this.db) {
            (0, bluebird_1.reject)("no db connection");
        }
        var Publication = this.db.collection(this.collectionName);
        return new Promise(function (resolve, reject) {
            // need to add relevant date to projection
            Publication.find(filter, { _id: 1 }).toArray(function (err, items) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(items);
                }
            });
        });
    };
    /**
     * Responds to OAI GetRecord requests.
     * @param parameters
     * @returns {Promise<any>}
     */
    MongoConnector.prototype.getRecord = function (parameters, filter) {
        if (!this.db) {
            (0, bluebird_1.reject)("no db connection");
        }
        var Publication = this.db.collection(this.collectionName);
        return new Promise(function (resolve, reject) {
            var _a;
            var query = {
                $and: [
                    (_a = {}, _a["".concat((0, env_1.getCollectionID)())] = parameters.identifier, _a),
                    filter,
                ]
            };
            Publication.findOne(query, {}, function (err, item) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(item);
                }
            });
        });
    };
    MongoConnector.prototype.aggregatePublicationQuery = function (pipeline) {
        if (!this.db) {
            (0, bluebird_1.reject)("no db connection");
        }
        var collection = this.db.collection(this.collectionName);
        var resolve = null;
        return new Promise(function (resolve, err) {
            var resolve = collection.aggregate(pipeline, function (err, cursor) {
                cursor.toArray(function (err, resolve) {
                    if (err) {
                        logger_1.default.error("recordsQuery error:", err);
                    }
                });
            });
        });
    };
    MongoConnector.prototype.putPublication = function (parameters) {
        if (!this.db) {
            (0, bluebird_1.reject)("no db connection");
        }
        var Publication = this.db.collection(this.collectionName);
        return new Promise(function (resolve, reject) {
            Publication.insertOne(parameters, {}, function (err, item) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(item);
                }
            });
        });
    };
    MongoConnector.prototype.updatePublication = function (parameters) {
        if (!this.db) {
            (0, bluebird_1.reject)("no db connection");
        }
        var Publication = this.db.collection(this.collectionName);
        return new Promise(function (resolve, reject) {
            Publication.updateOne({ doi: parameters.doi }, { $set: parameters.body }, function (err, item) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(item);
                }
            });
        });
    };
    MongoConnector.prototype.countPublication = function (parameters) {
        if (!this.db) {
            (0, bluebird_1.reject)("no db connection");
        }
        var Publication = this.db.collection(this.collectionName);
        return new Promise(function (resolve, reject) {
            Publication.countDocuments(parameters, {}, function (err, count) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(count);
                }
            });
        });
    };
    // supports skip and limit
    MongoConnector.prototype.getPublication = function (query) {
        var _this = this;
        if (!this.db) {
            (0, bluebird_1.reject)("no db connection");
        }
        var Publication = this.db.collection(this.collectionName);
        return new Promise(function (resolve, reject) {
            var skip = 0;
            var limit = 0;
            var sort;
            if (query && query.skip) {
                skip = parseInt(query.skip);
            }
            if (query && query.limit) {
                limit = parseInt(query.limit);
            }
            if (query && query.sortField) {
                var sortDirectionInt = query.sortDirection === "asc" ? 1 : -1;
                sort = '{ "' + query.sortField + '" : ' + sortDirectionInt + '}';
                sort = JSON.parse(sort);
            }
            var project = _this.projectFields(query);
            Publication.find()
                .skip(skip)
                .limit(limit)
                .sort(sort)
                .project(project)
                .toArray(function (err, result) {
                if (err) {
                    logger_1.default.debug("Mongo Error. ", err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    };
    MongoConnector.prototype.projectFields = function (query) {
        var project = {};
        if (query && query.excludeFields) {
            query.excludeFields.split('|').reduce(function (previousValue, currentValue) { return (previousValue[currentValue] = 0, previousValue); }, project);
        }
        if (query && query.includeFields) {
            query.includeFields.split('|').reduce(function (previousValue, currentValue) { return (previousValue[currentValue] = 1, previousValue); }, project);
        }
        return project;
    };
    MongoConnector.prototype.findPublication = function (query) {
        if (!this.db) {
            (0, bluebird_1.reject)("no db connection");
        }
        var Publication = this.db.collection(this.collectionName);
        return new Promise(function (resolve, reject) {
            Publication.findOne({ doi: query }, {}, function (err, item) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(item);
                }
            });
        });
    };
    return MongoConnector;
}());
exports.MongoConnector = MongoConnector;
