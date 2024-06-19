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
exports.generateResponse = exports.generateException = void 0;
var xml = require("xml");
var exceptions_1 = require("./exceptions/exceptions");
var now = new Date();
now.setDate(now.getDate());
now.setMilliseconds(0);
var sNow = now.toISOString().split('.')[0] + "Z";
/**
 * The object used when creating OAI responses. XML responses are produced with the xml library. The
 * shape of this object is specific to that library.
 */
var responseTemplate = {
    'OAI-PMH': [
        {
            _attr: {
                xmlns: 'http://www.openarchives.org/OAI/2.0/',
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
                'xsi:schemaLocation': 'http://www.openarchives.org/OAI/2.0/ ' +
                    '\nhttp://www.openarchives.org/OAI/2.0/OAI-PMH.xsd'
            }
        },
        { responseDate: sNow }
    ]
};
/**
 * Generates the OAI xml response from JSON object.
 * @param {string} verb
 * @param {string} url
 * @param responseContent
 * @returns {string}
 */
function generateResponse(verb, url, responseContent) {
    var newResponse = JSON.parse(JSON.stringify(responseTemplate));
    newResponse['OAI-PMH'].push({ request: [{ _attr: verb }, url] });
    newResponse['OAI-PMH'].push(responseContent);
    return xml(newResponse, { declaration: true });
}
exports.generateResponse = generateResponse;
/**
 * Generates an OAI exception in xml.
 * @param {ExceptionParams} exception
 * @param {EXCEPTION_CODES} code
 * @returns {string | NodeJS.ReadableStream}
 */
function generateException(exception, code) {
    /**
     * Validate the argument types.
     */
    if (code === undefined) {
        throw new Error("Function arguments are missing:  code: ".concat(code));
    }
    if (exceptions_1.Exceptions.getExceptionMessage(code) === exceptions_1.Exceptions.UNKNOWN_CODE) {
        throw new Error("Unknown exception type: ".concat(code));
    }
    var newException = JSON.parse(JSON.stringify(responseTemplate));
    if (exception.verb && exception.identifier && exception.metadataPrefix) {
        newException['OAI-PMH'].push({
            request: [
                {
                    _attr: {
                        verb: exception.verb,
                        identifier: exception.identifier,
                        metadataPrefix: exception.metadataPrefix
                    }
                },
                exception.baseUrl
            ]
        });
    }
    else if (exception.verb && exception.identifier) {
        newException['OAI-PMH'].push({
            request: [
                {
                    _attr: {
                        verb: exception.verb,
                        identifier: exception.identifier
                    }
                },
                exception.baseUrl
            ]
        });
    }
    else if (exception.verb) {
        newException['OAI-PMH'].push({
            request: [
                {
                    _attr: { verb: exception.verb }
                },
                exception.baseUrl
            ]
        });
    }
    else {
        newException['OAI-PMH'].push({ request: exception.baseUrl });
    }
    newException['OAI-PMH'].push({ error: [{ _attr: { code: code } }, exceptions_1.Exceptions.getExceptionMessage(code)] });
    return xml(newException, { declaration: true });
}
exports.generateException = generateException;
