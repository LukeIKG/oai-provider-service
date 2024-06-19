"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenaireMapper = void 0;
var logger_1 = require("../../../server/logger");
var core_oai_provider_1 = require("../../core/core-oai-provider");
var OpenaireMapper = /** @class */ (function (_super) {
    __extends(OpenaireMapper, _super);
    function OpenaireMapper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.route = process.env.OPENAIRE_ROUTE || "/openaire/oai";
        return _this;
    }
    /**
     * The Universal Coordinated Time (UTC) date needs to be modifed
     * to match the local timezone.
     * @param record the raw data returned by the mongo dao query
     * @returns {string}
     */
    OpenaireMapper.prototype.setTimeZoneOffset = function (record) {
        var date = new Date(record.updatedAt);
        var timeZoneCorrection = new Date(date.getTime() + date.getTimezoneOffset() * -60000);
        return timeZoneCorrection.toISOString().split(".")[0] + "Z";
    };
    OpenaireMapper.prototype.getRightsMessage = function (restricted) {
        if (restricted) {
            return "Restricted to University users.";
        }
        return "Available to the public.";
    };
    OpenaireMapper.prototype.createItemRecord = function (record) {
        //const updatedAt: string = this.setTimeZoneOffset(record);
        var item = {
            record: [
                {
                    header: [
                        {
                            identifier: [
                                { _attr: { identifierType: "doi" } },
                                record[this.collection_id].toString()
                            ]
                        },
                        { setSpec: "openaire_data" },
                        { datestamp: "2020-01-01" }
                    ]
                },
                {
                    metadata: [
                        {
                            "datacite:resource": [
                                {
                                    _attr: {
                                        "xmlns:rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                                        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                                        "xmlns:dcterms": "http://purl.org/dc/terms/",
                                        "xmlns:datacite": "http://datacite.org/schema/kernel-4",
                                        xmlns: "http://namespace.openaire.eu/schema/oaire/",
                                        "xsi:schemaLocation": "http://www.openarchives.org/OAI/2.0/oai_dc/ " +
                                            "https://www.openaire.eu/schema/repo-lit/4.0/openaire.xsd"
                                    }
                                },
                                // ......does it matter what these fields are called?
                                {
                                    "datacite:titles": [{ title: record.title }]
                                },
                                {
                                    "datacite:identifier": [
                                        { _attr: { identifierType: "URL" } },
                                        "https://doi.org/" + record[this.collection_id].toString()
                                    ]
                                },
                                {
                                    "datacite:descriptions": [
                                        {
                                            description: [
                                                { _attr: { descriptionType: "Abstract" } },
                                                record.dataDescription
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "datacite:dates": [
                                        {
                                            "datacite:date": [
                                                { _attr: { dateType: "Issued" } },
                                                "2020-01-01"
                                            ]
                                        },
                                        {
                                            "datacite:date": [
                                                { _attr: { dateType: "Available" } },
                                                "2020-01-01"
                                            ]
                                        }
                                    ]
                                },
                                { "datacite:publicationYear": record.publicationYear },
                                {
                                    "datacite:creators": [
                                        {
                                            creator: [
                                                {
                                                    creatorName: record.creator
                                                },
                                                {
                                                    affiliation: record.affiliation
                                                }
                                            ]
                                        }
                                    ]
                                },
                                { "datacite:publisher": record.publisher }, //category?/ source?
                                { "datacite:version": 1 }, //category?/ source?
                                {
                                    "datacite:rightsList": [
                                        {
                                            "datacite:rights": [
                                                {
                                                    _attr: {
                                                        rightsURI: "info:eu-repo/semantics/openAccess"
                                                    }
                                                },
                                                "OpenAccess"
                                            ]
                                        }
                                    ]
                                }
                            ] //rights?
                            // .....add more fields here
                        }
                    ]
                }
            ]
        };
        return item;
    };
    OpenaireMapper.prototype.mapOaiDcListRecords = function (records) {
        var list = [];
        var response = {
            ListRecords: []
        };
        for (var _i = 0, records_1 = records; _i < records_1.length; _i++) {
            var record = records_1[_i];
            var item = this.createItemRecord(record);
            list.push(item);
        }
        logger_1.default.debug("Parsed " + list.length + " records into OAI xml format.");
        response.ListRecords = list;
        return response;
    };
    OpenaireMapper.prototype.mapOaiDcGetRecord = function (record) {
        if (!record) {
            throw new Error("Record not found");
        }
        var item = this.createItemRecord(record);
        logger_1.default.debug("Got item with id " + record[this.collection_id] + ", title: " + record.title);
        return item;
    };
    OpenaireMapper.prototype.mapOaiDcListIdentifiers = function (records) {
        var list = [];
        var response = {
            ListIdentifiers: []
        };
        for (var _i = 0, records_2 = records; _i < records_2.length; _i++) {
            var record = records_2[_i];
            var updatedAt = this.setTimeZoneOffset(record);
            var item = {
                record: [
                    {
                        header: [
                            { identifier: record[this.collection_id].toString() },
                            { datestamp: updatedAt }
                        ]
                    }
                ]
            };
            list.push(item);
        }
        response.ListIdentifiers = list;
        return response;
    };
    OpenaireMapper.prototype.mapOaiDcListSets = function (records) {
        var response = {
            ListSets: []
        };
        var list = [];
        var item = {
            set: [{ setName: "openaire_data" }, { setSpec: "openaire_data" }]
        };
        list.push(item);
        response.ListSets = list;
        return response;
    };
    return OpenaireMapper;
}(core_oai_provider_1.ProviderDCMapper));
exports.OpenaireMapper = OpenaireMapper;
