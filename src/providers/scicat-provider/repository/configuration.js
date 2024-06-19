"use strict";
/*
 *  Copyright 2018 Willamette University
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
exports.Configuration = void 0;
var core_oai_provider_1 = require("../../core/core-oai-provider");
/**
 * module configuration.
 */
var Configuration = /** @class */ (function () {
    function Configuration() {
        this.repositoryName = "Scicat Provider";
        this.baseURL = process.env.BASE_URL;
        this.protocolVersion = '2.0';
        this.adminEmail = process.env.ADMIN_USER_EMAIL;
        this.port = 0;
        this.description = "";
        this.deletedRecord = core_oai_provider_1.DELETED_RECORDS_SUPPORT.NO;
        this.granularity = core_oai_provider_1.HARVESTING_GRANULARITY.DATETIME;
        this.earliestDatestamp = '2017-01-00T03:24:00Z';
    }
    return Configuration;
}());
exports.Configuration = Configuration;
