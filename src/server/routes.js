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
var scicat = require("../providers/controllers/scicat");
var panosc = require("../providers/controllers/panosc");
var openaire = require("../providers/controllers/openaire");
var logger_1 = require("./logger");
function routes(app) {
    logger_1.default.debug('Setting express routes for OAI providers.');
    app.get('/', function (req, res) {
        var uptime = process.uptime() * 1000;
        return res.send({ "started": new Date(Date.now() - uptime).toISOString().split('.')[0] + "Z", "uptime": +uptime.toFixed(3) });
    });
    app.get('/scicat/oai', scicat.oai);
    app.get("/scicat/Publication/detail/:id?", scicat.findPublication);
    app.get("/scicat/Publication/count/:params?", scicat.countPublication);
    app.get("/scicat/Publication/:limits?", scicat.getPublication);
    app.post('/scicat/oai/Publication', scicat.putPublication);
    app.put('/scicat/oai/Publication/:id', scicat.updatePublication);
    //app.get('/scicat/Publication/:id', scicat.getPublication);
    app.get('/scicat/Publication', scicat.getPublication);
    app.get('/panosc/oai', panosc.oai);
    app.get('/openaire/oai', openaire.oai);
}
exports.default = routes;
;
