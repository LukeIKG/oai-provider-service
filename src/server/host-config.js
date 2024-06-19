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
exports.getHostConfiguration = exports.hasHostConfigurationFile = void 0;
var fs = require("fs");
var logger_1 = require("./logger");
var hostFile = process.env.HOST_CONFIGURATION;
function hasHostConfigurationFile() {
    if (!hostFile) {
        logger_1.default.warn("Host configuration file has not been registered.  See .env");
        return false;
    }
    try {
        fs.statSync(hostFile);
        return true;
    }
    catch (err) {
        logger_1.default.warn("Could not find the host configuration file.");
        return false;
    }
}
exports.hasHostConfigurationFile = hasHostConfigurationFile;
function getHostConfiguration() {
    try {
        return JSON.parse(fs.readFileSync(hostFile, 'utf8'));
    }
    catch (error) {
        logger_1.default.warn("Could not parse the host configuration file.");
    }
}
exports.getHostConfiguration = getHostConfiguration;
