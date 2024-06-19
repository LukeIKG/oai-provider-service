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
exports.factory = exports.SETS = exports.METADATA_FORMAT_OAI_DATACITE = exports.METADATA_FORMAT_PANOSC = void 0;
/**
 * @typedef {Object} record
 * @property {number}id
 * @property {string} title
 * @property {string} image
 * @property {string} url
 * @property {string} browseType
 * @property {string} description
 * @property {string} dates
 * @property {string} items
 * @property {string} ctype
 * @property {string} repoType
 * @property {string} restricted
 * @property {boolean} published
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} searchUrl
 */
var core_oai_provider_1 = require("../../core/core-oai-provider");
var mongo_dao_1 = require("../dao/mongo-dao");
/**
 * Factory function to create the oai provider
 * @param {Object} [options={}] - Implementation-specific configuration
 * @returns {DataRepository}
 */
var METADATA_FORMAT_PANOSC;
(function (METADATA_FORMAT_PANOSC) {
    METADATA_FORMAT_PANOSC["prefix"] = "panosc";
    METADATA_FORMAT_PANOSC["schema"] = "https://github.com/panosc-eu/fair-data-api/blob/master/panosc.xsd";
    METADATA_FORMAT_PANOSC["namespace"] = "http://scicat.esss.se/panosc";
})(METADATA_FORMAT_PANOSC || (exports.METADATA_FORMAT_PANOSC = METADATA_FORMAT_PANOSC = {}));
var METADATA_FORMAT_OAI_DATACITE;
(function (METADATA_FORMAT_OAI_DATACITE) {
    METADATA_FORMAT_OAI_DATACITE["prefix"] = "oai_datacite";
    METADATA_FORMAT_OAI_DATACITE["schema"] = "http://schema.datacite.org/meta/kernel-3/metadata.xsd";
    METADATA_FORMAT_OAI_DATACITE["namespace"] = "http://datacite.org/schema/kernel-3";
})(METADATA_FORMAT_OAI_DATACITE || (exports.METADATA_FORMAT_OAI_DATACITE = METADATA_FORMAT_OAI_DATACITE = {}));
var SETS;
(function (SETS) {
    SETS["setspec"] = "openaire_data";
    SETS["setname"] = "openaire_data";
})(SETS || (exports.SETS = SETS = {}));
function factory(options) {
    if (options === void 0) { options = {}; }
    var dao = mongo_dao_1.MongoConnector.getInstance();
    var filter = { status: "registered" };
    return Object.freeze({
        /**
         * Defines whether this repository supports sets.
         */
        setSupport: true,
        /**
         * Defines whether this repository supports resumption tokens.
         */
        resumptionSupport: false,
        /**
         * Get individual record.
         * @param parameters (identifier, metadataPrefix)
         * @returns {Promise<any>} Resolves with a {@link record}
         */
        getRecord: function (parameters) {
            return dao.getRecord(parameters, filter);
        },
        /**
         * Returns the metadata formats supported by this repository (DC only)
         * @param {string} identifier (not used)
         * @returns {Promise<METADATA_FORMAT_DC[]>}
         */
        getMetadataFormats: function (identifier) {
            if (identifier === void 0) { identifier = undefined; }
            // Since only DC is supported, safe to ignore the identifier param.
            return Promise.resolve([
                core_oai_provider_1.METADATA_FORMAT_DC,
                METADATA_FORMAT_PANOSC,
                METADATA_FORMAT_OAI_DATACITE
            ]);
        },
        /**
         * Used to retrieve the set structure of a repository. Not supported currently.
         * @param {string} resumptionToken
         * @returns {Promise<never>}
         */
        getSets: function (identifier) {
            if (identifier === void 0) { identifier = undefined; }
            return Promise.resolve([SETS]);
        },
        /**
         * Gets list of identifiers.
         * @param parameters (metadataPrefix, from (optional), until (optional), set (not supported),
         *        resumptionToken (not supported))
         * @returns {Promise<any>} an array of {@link record}
         */
        getIdentifiers: function (parameters) {
            return dao.identifiersQuery(parameters, filter);
        },
        /**
         * Gets list of records
         * @param parameters (metadataPrefix, from (optional), until (optional), set (not supported),
         *        resumptionToken (not supported))
         * @returns {Promise<any>} an array of {@link record}
         */
        getRecords: function (parameters) {
            return dao.recordsQuery(parameters, filter);
        }
    });
}
exports.factory = factory;
