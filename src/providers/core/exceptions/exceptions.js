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
exports.Exceptions = void 0;
var exception_messages_1 = require("./exception-messages");
var core_oai_provider_1 = require("../core-oai-provider");
var Exceptions = /** @class */ (function () {
    function Exceptions() {
    }
    /**
     * Maps OAI error codes to the corresponding error message.
     * @param {EXCEPTION_CODES} code
     * @returns {string}
     */
    Exceptions.getExceptionMessage = function (code) {
        switch (code) {
            case core_oai_provider_1.EXCEPTION_CODES.BAD_ARGUMENT: {
                return exception_messages_1.ExceptionMessages.BAD_ARGUMENT;
            }
            case core_oai_provider_1.EXCEPTION_CODES.BAD_RESUMPTION_TOKEN: {
                return exception_messages_1.ExceptionMessages.BAD_RESUMPTION_TOKEN;
            }
            case core_oai_provider_1.EXCEPTION_CODES.BAD_VERB: {
                return exception_messages_1.ExceptionMessages.BAD_VERB;
            }
            case core_oai_provider_1.EXCEPTION_CODES.CANNOT_DISSEMINATE_FORMAT: {
                return exception_messages_1.ExceptionMessages.CANNOT_DISSEMINATE_FORMAT;
            }
            case core_oai_provider_1.EXCEPTION_CODES.ID_DOES_NOT_EXIST: {
                return exception_messages_1.ExceptionMessages.ID_DOES_NOT_EXIST;
            }
            case core_oai_provider_1.EXCEPTION_CODES.NO_RECORDS_MATCH: {
                return exception_messages_1.ExceptionMessages.NO_RECORDS_MATCH;
            }
            case core_oai_provider_1.EXCEPTION_CODES.NO_METADATA_FORMATS: {
                return exception_messages_1.ExceptionMessages.NO_METADATA_FORMATS;
            }
            case core_oai_provider_1.EXCEPTION_CODES.NO_SET_HIERARCHY: {
                return exception_messages_1.ExceptionMessages.NO_SET_HEIRARCHY;
            }
            default: {
                return this.UNKNOWN_CODE;
            }
        }
    };
    Exceptions.UNKNOWN_CODE = "unknown code";
    return Exceptions;
}());
exports.Exceptions = Exceptions;
