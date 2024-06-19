"use strict";
/*
 *  Original work Copyright 2018 Willamette University
 *  Modified work Copyright 2019 SciCat Organisations
 *
 *  This file is part of OAI-PHM Service.
 *
 *  @author Michael Spalti
 *
 *  OAI-PHM Service is based on the Modular OAI-PMH Server, University of Helsinki,
 *  The National Library of Finland.
 *
 *  OAI-PHM Service is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  OAI-PHM Service is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with OAI-PHM Service.  If not, see <http://www.gnu.org/licenses/>.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreOaiProvider = exports.EXCEPTION_CODES = exports.VERBS = exports.ProviderDCMapper = exports.METADATA_FORMAT_DC = exports.ERRORS = exports.DELETED_RECORDS_SUPPORT = exports.HARVESTING_GRANULARITY = void 0;
var oai_response_1 = require("./oai-response");
var env_1 = require("../../server/env");
var oai_service_1 = require("./oai-service");
var logger_1 = require("../../server/logger");
/**
 * The time formats that can be returned with OAI Identify requests.
 */
var HARVESTING_GRANULARITY;
(function (HARVESTING_GRANULARITY) {
    HARVESTING_GRANULARITY["DATE"] = "YYYY-MM-DD";
    HARVESTING_GRANULARITY["DATETIME"] = "YYYY-MM-DDThh:mm:ssZ";
})(HARVESTING_GRANULARITY || (exports.HARVESTING_GRANULARITY = HARVESTING_GRANULARITY = {}));
/**
 * The standard OAI responses for deleted record support that can be
 * returned with OAI Identify requests.
 */
var DELETED_RECORDS_SUPPORT;
(function (DELETED_RECORDS_SUPPORT) {
    DELETED_RECORDS_SUPPORT["NO"] = "no";
    DELETED_RECORDS_SUPPORT["TRANSIENT"] = "transient";
    DELETED_RECORDS_SUPPORT["PERSISTENT"] = "persistent";
})(DELETED_RECORDS_SUPPORT || (exports.DELETED_RECORDS_SUPPORT = DELETED_RECORDS_SUPPORT = {}));
// Not actually returning these as error codes.
// Using the verb name.
var ERRORS;
(function (ERRORS) {
    ERRORS[ERRORS["badArgument"] = 0] = "badArgument";
    ERRORS[ERRORS["badResumptionToken"] = 1] = "badResumptionToken";
    ERRORS[ERRORS["badVerb"] = 2] = "badVerb";
    ERRORS[ERRORS["cannotDisseminateFormat"] = 4] = "cannotDisseminateFormat";
    ERRORS[ERRORS["idDoesNotExist"] = 8] = "idDoesNotExist";
    ERRORS[ERRORS["noRecordsMatch"] = 16] = "noRecordsMatch";
    ERRORS[ERRORS["noMetadataFormats"] = 32] = "noMetadataFormats";
    ERRORS[ERRORS["noSetHierarchy"] = 64] = "noSetHierarchy";
})(ERRORS || (exports.ERRORS = ERRORS = {}));
/**
 * OAI definition for the Dublin Core metatdata format.
 */
var METADATA_FORMAT_DC;
(function (METADATA_FORMAT_DC) {
    METADATA_FORMAT_DC["prefix"] = "oai_dc";
    METADATA_FORMAT_DC["schema"] = "http://www.openarchives.org/OAI/2.0/oai_dc.xsd";
    METADATA_FORMAT_DC["namespace"] = "http://www.openarchives.org/OAI/2.0/oai_dc/";
})(METADATA_FORMAT_DC || (exports.METADATA_FORMAT_DC = METADATA_FORMAT_DC = {}));
/**
 * Interface for the class that maps between DAO data and
 * formatted OAI xml.
 */
var ProviderDCMapper = /** @class */ (function () {
    function ProviderDCMapper() {
    }
    Object.defineProperty(ProviderDCMapper.prototype, "collection_id", {
        get: function () { return (0, env_1.getCollectionID)(); },
        enumerable: false,
        configurable: true
    });
    ;
    return ProviderDCMapper;
}());
exports.ProviderDCMapper = ProviderDCMapper;
/**
 * OAI verbs.
 */
var VERBS;
(function (VERBS) {
    VERBS["IDENTIFY"] = "Identify";
    VERBS["LIST_METADATA_FORMATS"] = "ListMetadataFormats";
    VERBS["LIST_SETS"] = "ListSets";
    VERBS["GET_RECORD"] = "GetRecord";
    VERBS["LIST_IDENTIFIERS"] = "ListIdentifiers";
    VERBS["LIST_RECORDS"] = "ListRecords";
})(VERBS || (exports.VERBS = VERBS = {}));
/**
 * The OAI codes returned in exceptions.
 */
var EXCEPTION_CODES;
(function (EXCEPTION_CODES) {
    EXCEPTION_CODES["BAD_ARGUMENT"] = "badArgument";
    EXCEPTION_CODES["BAD_RESUMPTION_TOKEN"] = "badResumptionToken";
    EXCEPTION_CODES["BAD_VERB"] = "badVerb";
    EXCEPTION_CODES["CANNOT_DISSEMINATE_FORMAT"] = "cannotDisseminateFormat";
    EXCEPTION_CODES["ID_DOES_NOT_EXIST"] = "idDoesNotExist";
    EXCEPTION_CODES["NO_RECORDS_MATCH"] = "noRecordsMatch";
    EXCEPTION_CODES["NO_METADATA_FORMATS"] = "noMetadataFormats";
    EXCEPTION_CODES["NO_SET_HIERARCHY"] = "noSetHierarchy";
})(EXCEPTION_CODES || (exports.EXCEPTION_CODES = EXCEPTION_CODES = {}));
/**
 * The core OAI provider class instantiates an `OaiService` that has been configured with
 * a single data repository module.
 */
var CoreOaiProvider = /** @class */ (function () {
    /**
     * The constructor initializes the core provider with a single provider module.
     * @param factory the provider module's factory method
     * @param {ProviderConfiguration} the provider module configuration
     * @param {ProviderDCMapper} the provider module mapper (typically maps to Dublin Core)
     */
    function CoreOaiProvider(factory, configuration, mapper) {
        this.possibleParams = ['verb', 'from', 'until', 'metadataPrefix', 'set', 'resumptionToken'];
        this.oaiService = new oai_service_1.OaiService(factory, configuration);
        this.parameters = this.oaiService.getParameters();
        this.mapper = mapper;
        this.parameters.baseURL += this.mapper.route;
    }
    /**
     * Handle OAI requests. These methods return OAI provider configuration,
     * data, or error responses from the repository provider module that has been
     * configured in `OaiService`.
     */
    /**
     * Handles `ListMetatadataFormats` requests using the current repository module.
     * @param {MetadataFormatParameters} query
     * @returns {Promise<string>}
     */
    CoreOaiProvider.prototype.listMetadataFormats = function (query) {
        var _this = this;
        logger_1.default.debug('ListMetadataFormats');
        return new Promise(function (resolve, reject) {
            var queryParameters = _this.getQueryParameters(query);
            var exception = {
                baseUrl: _this.parameters.baseURL,
                verb: VERBS.LIST_METADATA_FORMATS,
                metadataPrefix: METADATA_FORMAT_DC.prefix
            };
            if (queryParameters.length > 2 || (queryParameters.length === 2 &&
                !_this.hasKey(query, 'identifier'))) {
                resolve((0, oai_response_1.generateException)(exception, EXCEPTION_CODES.BAD_ARGUMENT));
            }
            else {
                var args = _this.hasKey(query, 'identifier') ? query.identifier : undefined;
                _this.oaiService.getProvider().getMetadataFormats(args).then(function (formats) {
                    try {
                        var responseContent = {
                            ListMetadataFormats: formats.map(function (format) {
                                return {
                                    metadataFormat: [
                                        { metadataPrefix: format.prefix },
                                        { schema: format.schema },
                                        { metadataNamespace: format.namespace }
                                    ]
                                };
                            })
                        };
                        resolve((0, oai_response_1.generateResponse)(query, _this.parameters.baseURL, responseContent));
                    }
                    catch (err) {
                        logger_1.default.error(err);
                        reject((0, oai_response_1.generateException)(exception, EXCEPTION_CODES.NO_METADATA_FORMATS));
                    }
                });
            }
        });
    };
    /**
     * Handles `GetRecord` requests using the current repository module.
     * @param {RecordParamters} query
     * @returns {Promise<string>}
     */
    CoreOaiProvider.prototype.getRecord = function (query) {
        var _this = this;
        logger_1.default.debug('GetRecord');
        return new Promise(function (resolve, reject) {
            var queryParameters = _this.getQueryParameters(query);
            var exception = {
                baseUrl: _this.parameters.baseURL,
                verb: VERBS.GET_RECORD,
                identifier: query.identifier,
                metadataPrefix: METADATA_FORMAT_DC.prefix
            };
            if (queryParameters.length !== 3 ||
                !_this.hasKey(query, 'identifier') ||
                !_this.hasKey(query, 'metadataPrefix')) {
                resolve((0, oai_response_1.generateException)(exception, EXCEPTION_CODES.BAD_ARGUMENT));
            }
            else {
                _this.oaiService.getProvider().getRecord(query)
                    .then(function (record) {
                    try {
                        if (record) {
                            var mapped = _this.mapper.mapOaiDcGetRecord(record);
                            resolve((0, oai_response_1.generateResponse)(query, _this.parameters.baseURL, mapped));
                        }
                        else {
                            // There should be one matching record.
                            resolve((0, oai_response_1.generateException)(exception, EXCEPTION_CODES.ID_DOES_NOT_EXIST));
                        }
                    }
                    catch (err) {
                        logger_1.default.error(err);
                        reject((0, oai_response_1.generateException)(exception, EXCEPTION_CODES.ID_DOES_NOT_EXIST));
                    }
                })
                    .catch(function (err) {
                    logger_1.default.error(err);
                    // If dao query errs, return OAI error.
                    reject((0, oai_response_1.generateException)(exception, EXCEPTION_CODES.ID_DOES_NOT_EXIST));
                });
            }
        });
    };
    /**
     * Handles `ListIdentifiers` requests using the current repository module.
     * @param {ListParameters} query
     * @returns {Promise<string>}
     */
    CoreOaiProvider.prototype.listIdentifiers = function (query) {
        var _this = this;
        logger_1.default.debug('ListIdentifiers');
        return new Promise(function (resolve, reject) {
            var queryParameters = _this.getQueryParameters(query);
            var exception = {
                baseUrl: _this.parameters.baseURL,
                verb: VERBS.LIST_IDENTIFIERS,
                metadataPrefix: METADATA_FORMAT_DC.prefix
            };
            // Valid parameter count.
            if ((queryParameters.length > 6 || queryParameters.length < 2)) {
                resolve((0, oai_response_1.generateException)(exception, EXCEPTION_CODES.BAD_ARGUMENT));
            }
            // Verify that query parameters are valid for this repository.
            if (_this.hasInvalidListParameter(queryParameters, query)) {
                resolve((0, oai_response_1.generateException)(exception, EXCEPTION_CODES.BAD_ARGUMENT));
            }
            // If set is requested, verify that it is supported by this repository.
            if (_this.hasKey(query, 'set')) {
                if (!_this.hasSetSupport()) {
                    resolve((0, oai_response_1.generateException)(exception, EXCEPTION_CODES.NO_SET_HIERARCHY));
                }
            }
            // Execute the request.
            _this.oaiService.getProvider().getIdentifiers(query)
                .then(function (result) {
                if (result.length === 0) {
                    resolve((0, oai_response_1.generateException)(exception, EXCEPTION_CODES.NO_RECORDS_MATCH));
                }
                try {
                    var mapped = _this.mapper.mapOaiDcListIdentifiers(result);
                    resolve((0, oai_response_1.generateResponse)(query, _this.parameters.baseURL, mapped));
                }
                catch (err) {
                    // Log the error and return OAI error message.
                    logger_1.default.error(err);
                    reject((0, oai_response_1.generateException)(exception, EXCEPTION_CODES.NO_RECORDS_MATCH));
                }
            })
                .catch(function (err) {
                logger_1.default.error(err);
                // If dao query fails, return OAI error.
                reject((0, oai_response_1.generateException)(exception, EXCEPTION_CODES.NO_RECORDS_MATCH));
            });
        });
    };
    /**
     * Handles `ListRecords` requests using the current repository module.
     * @param {ListParameters} query
     * @returns {Promise<any>}
     */
    CoreOaiProvider.prototype.listRecords = function (query) {
        var _this = this;
        logger_1.default.debug('ListRecords', query);
        return new Promise(function (resolve, reject) {
            var queryParameters = _this.getQueryParameters(query);
            var exception = {
                baseUrl: _this.parameters.baseURL,
                verb: VERBS.LIST_RECORDS,
                metadataPrefix: METADATA_FORMAT_DC.prefix
            };
            // Valid parameter count.
            if ((queryParameters.length > 6 || queryParameters.length < 2)) {
                resolve((0, oai_response_1.generateException)(exception, EXCEPTION_CODES.BAD_ARGUMENT));
            }
            // Verify that query parameters are valid for this repository.
            if (_this.hasInvalidListParameter(queryParameters, query)) {
                resolve((0, oai_response_1.generateException)(exception, EXCEPTION_CODES.BAD_ARGUMENT));
            }
            // If set is requested, verify that it is supported by this repository.
            if (_this.hasKey(query, 'set')) {
                if (!_this.hasSetSupport()) {
                    resolve((0, oai_response_1.generateException)(exception, EXCEPTION_CODES.NO_SET_HIERARCHY));
                }
            }
            // Execute the request.
            _this.oaiService.getProvider().getRecords(query)
                .then(function (result) {
                if (result.length === 0) {
                    resolve((0, oai_response_1.generateException)(exception, EXCEPTION_CODES.NO_RECORDS_MATCH));
                }
                try {
                    var mapped = _this.mapper.mapOaiDcListRecords(result);
                    resolve((0, oai_response_1.generateResponse)(query, _this.parameters.baseURL, mapped));
                }
                catch (err) {
                    // Log the error and return OAI error message.
                    logger_1.default.error(err);
                    reject((0, oai_response_1.generateException)(exception, EXCEPTION_CODES.NO_RECORDS_MATCH));
                }
            })
                .catch(function (err) {
                logger_1.default.error(err);
                // If dao query fails, return OAI error.
                reject((0, oai_response_1.generateException)(exception, EXCEPTION_CODES.NO_RECORDS_MATCH));
            });
        });
    };
    /**
     * Handles `Identify` requests using the current repository module.
     * @param {any} query
     * @returns {Promise<any>}
     */
    CoreOaiProvider.prototype.identify = function (query) {
        var _this = this;
        logger_1.default.debug("Identify");
        return new Promise(function (resolve, reject) {
            var queryParameters = _this.getQueryParameters(query);
            var exception = {
                baseUrl: _this.parameters.baseURL,
                verb: VERBS.IDENTIFY
            };
            try {
                if (queryParameters.length > 1) {
                    resolve((0, oai_response_1.generateException)(exception, EXCEPTION_CODES.BAD_ARGUMENT));
                }
                else {
                    var responseContent = {
                        Identify: [
                            { repositoryName: _this.parameters.repositoryName },
                            { baseURL: _this.parameters.baseURL },
                            { protocolVersion: _this.parameters.protocolVersion },
                            { adminEmail: _this.parameters.adminEmail },
                            { earliestDatestamp: _this.parameters.earliestDatestamp },
                            { deletedRecord: _this.parameters.deletedRecord },
                            { granularity: _this.parameters.granularity }
                        ]
                    };
                    resolve((0, oai_response_1.generateResponse)(query, _this.parameters.baseURL, responseContent));
                }
            }
            catch (err) {
                logger_1.default.log(err);
                reject((0, oai_response_1.generateException)(exception, EXCEPTION_CODES.BAD_ARGUMENT));
            }
        });
    };
    /**
     * Handles `ListSets` requests using the current repository module.
     * @param {any} query
     * @returns {Promise<any>}
     */
    CoreOaiProvider.prototype.listSets = function (query) {
        var _this = this;
        /**
         * Parameters: resumptionToken (exclusive)
         * exceptions: badArgument, badResumptionToken, noSetHierarchy
         */
        return new Promise(function (resolve, reject) {
            var queryParameters = _this.getQueryParameters(query);
            var exception = {
                baseUrl: _this.parameters.baseURL,
                verb: VERBS.LIST_SETS
            };
            /*if (queryParameters.length > 2 || (queryParameters.length === 2 &&
                    !this.hasKey(query, 'resumptionToken'))) {
                resolve(generateException(exception, EXCEPTION_CODES.BAD_ARGUMENT));
            } else {*/
            var mapped = _this.mapper.mapOaiDcListSets(null);
            resolve((0, oai_response_1.generateResponse)(query, _this.parameters.baseURL, mapped));
            /* }*/
        });
    };
    /**
     * Checks for key on the queryParameters object.
     * @param {object}
     * @param {string}
     * @returns {boolean}
     */
    CoreOaiProvider.prototype.hasKey = function (queryParameters, key) {
        return Object.prototype.hasOwnProperty.call(queryParameters, key);
    };
    /**
     * Gets the query parameters provided by the http Request.
     * @param query
     * @returns {any[]}
     */
    CoreOaiProvider.prototype.getQueryParameters = function (query) {
        return Object.keys(query).map(function (key) { return query[key]; });
    };
    /**
     * Validates that we have valid from and until value.
     * @param parameters
     * @returns {boolean}
     */
    CoreOaiProvider.prototype.hasValidSelectiveParams = function (parameters) {
        if (parameters.until) {
            if (!parameters.from) {
                return false;
            }
            return parseInt(parameters.from) <= parseInt(parameters.until);
        }
        return true;
    };
    CoreOaiProvider.prototype.hasSetSupport = function () {
        return this.oaiService.getProvider().setSupport;
    };
    CoreOaiProvider.prototype.hasResumptionTokenSupport = function () {
        return this.oaiService.getProvider().resumptionSupport;
    };
    CoreOaiProvider.prototype.isNotRecognizedParameter = function (query) {
        var _this = this;
        return (!Object.keys(query).every(function (key) { return _this.possibleParams.indexOf(key) >= 0; }));
    };
    CoreOaiProvider.prototype.hasExclusiveParameterViolation = function (queryParameters, query) {
        return (queryParameters.length === 2 && (!this.hasKey(query, 'metadataPrefix') &&
            !this.hasKey(query, 'resumptionToken')));
    };
    CoreOaiProvider.prototype.hasInvalidListParameter = function (queryParameters, query) {
        if (this.isNotRecognizedParameter(query)) {
            return true;
        }
        else if (this.hasKey(query, 'resumptionToken')) {
            if (!this.hasResumptionTokenSupport()) {
                return true;
            }
        }
        else if (this.hasExclusiveParameterViolation(queryParameters, query)) {
            return true;
        }
        else if (!this.hasValidSelectiveParams(query)) {
            return true;
        }
        return false;
    };
    return CoreOaiProvider;
}());
exports.CoreOaiProvider = CoreOaiProvider;
