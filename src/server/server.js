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
var express = require("express");
var bodyParser = require("body-parser");
var http = require("http");
var logger_1 = require("./logger");
var host_config_1 = require("./host-config");
var cors = require('cors');
var app = express();
var ExpressServer = /** @class */ (function () {
    function ExpressServer() {
        var options = {
            allowedHeaders: [
                "Origin",
                "X-Requested-With",
                "Content-Type",
                "Accept",
                "X-Access-Token"
            ],
            credentials: true,
            methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
            //origin: API_URL,
            preflightContinue: false
        };
        app.use(bodyParser.json({ limit: "50mb" }));
        app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
        app.use(cors(options));
    }
    ExpressServer.prototype.router = function (routes) {
        routes(app);
        return this;
    };
    ExpressServer.prototype.listen = function () {
        var config = this.getConfiguration();
        var port = this.getPort(config);
        var welcome = function () {
            logger_1.default.info("******** Up and running in ".concat(process.env.NODE_ENV ||
                "development", " @: ").concat(process.env.BASE_URL, " on port: ").concat(port, "}***********"));
        };
        http.createServer(app).listen(port, welcome());
        return app;
    };
    /**
     * Returns default port if host configuration is not available.
     * @returns {number}
     */
    ExpressServer.prototype.getConfiguration = function () {
        if ((0, host_config_1.hasHostConfigurationFile)()) {
            return (0, host_config_1.getHostConfiguration)();
        }
        else {
            logger_1.default.warn("No configuration provided. Using default port. See documentation for details.");
            return { port: 3000 };
        }
    };
    /**
     * Return configuration port or default port.
     * @param configuration
     * @returns {number}
     */
    ExpressServer.prototype.getPort = function (configuration) {
        if (configuration) {
            if (configuration.port) {
                return configuration.port;
            }
        }
        return 3000;
    };
    return ExpressServer;
}());
exports.default = ExpressServer;
