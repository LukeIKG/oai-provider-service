"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oai = void 0;
var core_oai_provider_1 = require("../core/core-oai-provider");
var oai_response_1 = require("../core/oai-response");
var logger_1 = require("../../server/logger");
var scicat_data_repository_1 = require("../scicat-provider/repository/scicat-data-repository");
var configuration_1 = require("../scicat-provider/repository/configuration");
var openaire_mapper_1 = require("../scicat-provider/repository/openaire-mapper");
var MongoClient = require("mongodb").MongoClient;
/**
 * This is a CoreOaiProvider instance configured for the sample repository module.
 * Module configuration is provided via constructor parameters.
 * @type {CoreOaiProvider}
 */
var provider = new core_oai_provider_1.CoreOaiProvider(scicat_data_repository_1.factory, new configuration_1.Configuration(), new openaire_mapper_1.OpenaireMapper());
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
    res.set('Content-Type', 'text/xml');
    switch (req.query.verb) {
        case 'Identify':
            logger_1.default.debug('Identify request.');
            provider.identify(req.query)
                .then(function (response) {
                res.send(response);
            })
                .catch(function (oaiError) {
                res.status(500);
                res.send(oaiError);
            });
            break;
        case 'ListMetadataFormats':
            logger_1.default.debug('ListMetadataFormats request.');
            provider.listMetadataFormats(req.query)
                .then(function (response) {
                res.send(response);
            })
                .catch(function (oaiError) {
                res.status(500);
                res.send(oaiError);
            });
            break;
        case 'ListIdentifiers':
            logger_1.default.debug('ListIdentifiers request.');
            provider.listIdentifiers(req.query)
                .then(function (response) {
                res.send(response);
            })
                .catch(function (oaiError) {
                res.status(500);
                res.send(oaiError);
            });
            break;
        case 'ListRecords':
            logger_1.default.debug('ListRecords request.');
            provider.listRecords(req.query)
                .then(function (response) {
                res.send(response);
            })
                .catch(function (oaiError) {
                res.status(500);
                res.send(oaiError);
            });
            break;
        case 'ListSets':
            logger_1.default.debug('ListSet request.');
            provider.listSets(req.query)
                .then(function (response) {
                res.send(response);
            })
                .catch(function (oaiError) {
                res.status(500);
                res.send(oaiError);
            });
            break;
        case 'GetRecord':
            logger_1.default.debug('GetRecord request.');
            provider.getRecord(req.query)
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
                baseUrl: req.protocol + '://' + req.get('host') + req.path
            };
            res.send((0, oai_response_1.generateException)(exception, core_oai_provider_1.EXCEPTION_CODES.BAD_VERB));
    }
};
exports.oai = oai;
