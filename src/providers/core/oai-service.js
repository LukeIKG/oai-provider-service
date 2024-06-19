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
exports.OaiService = void 0;
var logger_1 = require("../../server/logger");
var OaiService = /** @class */ (function () {
    /**
     * The service constructor requires a factory method and configuration
     * parameters for an repository provider module.
     * @param factory
     * @param {ProviderConfiguration} configuration
     */
    function OaiService(factory, configuration) {
        logger_1.default.debug("Creating the OAI data provider for: " + configuration.repositoryName);
        this.parameters = configuration;
        this.oaiProvider = factory(this.parameters);
    }
    /**
     * Returns the repository configuration for this instance.
     * @returns {ProviderConfiguration}
     */
    OaiService.prototype.getParameters = function () {
        return this.parameters;
    };
    /**
     * Returns the OAI data provider configured for this instance.
     * @returns {DataRepository}
     */
    OaiService.prototype.getProvider = function () {
        return this.oaiProvider;
    };
    return OaiService;
}());
exports.OaiService = OaiService;
