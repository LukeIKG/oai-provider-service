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
exports.ExceptionMessages = void 0;
/**
 * Messages returned in OAI exception responses.
 */
var ExceptionMessages;
(function (ExceptionMessages) {
    ExceptionMessages["BAD_ARGUMENT"] = "The request includes illegal arguments, is missing required arguments, includes a repeated argument, or values for arguments have an illegal syntax.";
    ExceptionMessages["BAD_RESUMPTION_TOKEN"] = "The resumption token is invalid";
    ExceptionMessages["BAD_VERB"] = "Value of the verb argument is not a legal OAI-PMH verb, the verb argument is missing or the verb argument is repeated.";
    ExceptionMessages["CANNOT_DISSEMINATE_FORMAT"] = "The metadata format identified by the value given for the metadataPrefix argument is not supported by the item or by the repository.";
    ExceptionMessages["ID_DOES_NOT_EXIST"] = "The value of the identifier argument is unknown or illegal in this repository.";
    ExceptionMessages["NO_RECORDS_MATCH"] = "The combination of the values of the from, until, set and metadataPrefix arguments results in an empty list.";
    ExceptionMessages["NO_METADATA_FORMATS"] = "There are no metadata formats available for the specified item.";
    ExceptionMessages["NO_SET_HEIRARCHY"] = "The repository does not support sets.";
    ExceptionMessages["UNKNOWN_CODE"] = "unknown";
})(ExceptionMessages || (exports.ExceptionMessages = ExceptionMessages = {}));
