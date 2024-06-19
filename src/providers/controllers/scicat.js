"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseParams = exports.findPublication = exports.getPublication = exports.countPublication = exports.updatePublication = exports.putPublication = exports.oai = void 0;
var core_oai_provider_1 = require("../core/core-oai-provider");
var oai_response_1 = require("../core/oai-response");
var logger_1 = require("../../server/logger");
var scicat_data_repository_1 = require("../scicat-provider/repository/scicat-data-repository");
var configuration_1 = require("../scicat-provider/repository/configuration");
var scicat_dc_mapper_1 = require("../scicat-provider/repository/scicat-dc-mapper");
var mongo_dao_1 = require("../scicat-provider/dao/mongo-dao"); // only for put method
/**
 * This is a CoreOaiProvider instance configured for the sample repository module.
 * Module configuration is provided via constructor parameters.
 * @type {CoreOaiProvider}
 */
var provider = new core_oai_provider_1.CoreOaiProvider(scicat_data_repository_1.factory, new configuration_1.Configuration(), new scicat_dc_mapper_1.ScicatDcMapper());
/**
 * This controller handles all OAI requests to the sample module.
 *
 * OAI exceptions that result from successful request processing are returned in
 * the Response with status code 200. The Promises will reject when unexpected
 * processing errors occur. These rejections are handled by returning an OAI
 * exception with a 500 status code. That seems to be the best approach
 * to exception handling, but might need to be revised if we learn otherwise.
 * @param {Request} req
 * @param {Response} res
 */
var oai = function (req, res) {
    res.set("Content-Type", "text/xml");
    logger_1.default.debug("Request:", req.query);
    switch (req.query.verb) {
        case "Identify":
            logger_1.default.debug("Identify request.");
            provider
                .identify(req.query)
                .then(function (response) {
                res.send(response);
            })
                .catch(function (oaiError) {
                res.status(500);
                res.send(oaiError);
            });
            break;
        case "ListMetadataFormats":
            logger_1.default.debug("ListMetadataFormats request.");
            provider
                .listMetadataFormats(req.query)
                .then(function (response) {
                res.send(response);
            })
                .catch(function (oaiError) {
                res.status(500);
                res.send(oaiError);
            });
            break;
        case "ListIdentifiers":
            logger_1.default.debug("ListIdentifiers request.");
            provider
                .listIdentifiers(req.query)
                .then(function (response) {
                res.send(response);
            })
                .catch(function (oaiError) {
                res.status(500);
                res.send(oaiError);
            });
            break;
        case "ListRecords":
            logger_1.default.debug("ListRecords request.");
            provider
                .listRecords(req.query)
                .then(function (response) {
                res.send(response);
            })
                .catch(function (oaiError) {
                res.status(500);
                res.send(oaiError);
            });
            break;
        case "ListSets":
            logger_1.default.debug("ListSets request.");
            provider
                .listSets(req.query)
                .then(function (response) {
                res.send(response);
            })
                .catch(function (oaiError) {
                res.status(500);
                res.send(oaiError);
            });
            break;
        case "GetRecord":
            logger_1.default.debug("GetRecord request.");
            provider
                .getRecord(req.query)
                .then(function (response) {
                res.send(response);
            })
                .catch(function (oaiError) {
                res.status(500);
                res.send(oaiError);
            });
            break;
        default:
            var exception = {
                baseUrl: req.protocol + "://" + req.get("host") + req.path,
            };
            res.send((0, oai_response_1.generateException)(exception, core_oai_provider_1.EXCEPTION_CODES.BAD_VERB));
    }
};
exports.oai = oai;
var putPublication = function (req, res) {
    logger_1.default.debug("Put publication request.");
    var dao = mongo_dao_1.MongoConnector.getInstance();
    dao
        .putPublication(req.body)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (oaiError) {
        res.status(500);
        res.send(oaiError);
    });
};
exports.putPublication = putPublication;
var updatePublication = function (req, res) {
    logger_1.default.debug("Update publication request.", decodeURIComponent(req.params.id));
    var dao = mongo_dao_1.MongoConnector.getInstance();
    var doi = decodeURIComponent(req.params.id);
    var body = req.body;
    var params = { doi: doi, body: body };
    dao
        .updatePublication(params)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (oaiError) {
        logger_1.default.debug("Failed to update publication.");
        res.status(500);
        res.send(oaiError);
    });
};
exports.updatePublication = updatePublication;
var countPublication = function (req, res) {
    logger_1.default.debug("Count publications request.");
    var dao = mongo_dao_1.MongoConnector.getInstance();
    dao
        .countPublication(null)
        .then(function (count) {
        res.send({ count: count });
    })
        .catch(function (oaiError) {
        res.status(500);
        res.send(oaiError);
    });
};
exports.countPublication = countPublication;
// is commonly a cross origin request
var getPublication = function (req, res) {
    logger_1.default.debug("Get publications request. ", req.params.limits);
    var limits = req.params.limits;
    var params = (0, exports.parseParams)(limits);
    var dao = mongo_dao_1.MongoConnector.getInstance();
    dao
        .getPublication(params)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (oaiError) {
        res.status(500);
        res.send(oaiError);
    });
};
exports.getPublication = getPublication;
// is commonly a cross origin request
var findPublication = function (req, res) {
    logger_1.default.debug("Find publications request.", decodeURIComponent(req.params.id));
    // need to decode doi parameter from URL
    var dao = mongo_dao_1.MongoConnector.getInstance();
    var doi = decodeURIComponent(req.params.id);
    dao
        .findPublication(doi)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (oaiError) {
        res.status(500);
        res.send(oaiError);
    });
};
exports.findPublication = findPublication;
var parseParams = function (limits) {
    var params = null;
    if (limits) {
        // decode limits string and convert to JSON
        var parts = decodeURIComponent(limits)
            .replace(/[()]/g, "")
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"');
        var partsArr = parts.split(",");
        partsArr.forEach(function (part, index) {
            this[index] = '"' + this[index].replace(/[:]/g, ":") + '"';
        }, partsArr);
        params = JSON.parse("{" + partsArr.join(",") + "}");
    }
    return params;
};
exports.parseParams = parseParams;
