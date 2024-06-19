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
exports.ScicatPanoscMapper = void 0;
var logger_1 = require("../../../server/logger");
var core_oai_provider_1 = require("../../core/core-oai-provider");
var ScicatPanoscMapper = /** @class */ (function (_super) {
    __extends(ScicatPanoscMapper, _super);
    function ScicatPanoscMapper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.route = process.env.PANOSC_ROUTE || "/panosc/oai";
        return _this;
    }
    /**
     * The Universal Coordinated Time (UTC) date needs to be modifed
     * to match the local timezone.
     * @param record the raw data returned by the mongo dao query
     * @returns {string}
     */
    ScicatPanoscMapper.prototype.setTimeZoneOffset = function (record) {
        var date = new Date(record.updatedAt);
        var timeZoneCorrection = new Date(date.getTime() + date.getTimezoneOffset() * -60000);
        return timeZoneCorrection.toISOString().split(".")[0] + "Z";
    };
    ScicatPanoscMapper.prototype.getRightsMessage = function (restricted) {
        if (restricted) {
            return "Restricted to University users.";
        }
        return "Available to the public.";
    };
    ScicatPanoscMapper.prototype.createItemRecord = function (record) {
        //const updatedAt: string = this.setTimeZoneOffset(record);
        var item = {
            record: [
                {
                    header: [
                        { identifier: record[this.collection_id].toString() },
                        { setSpec: "openaire_data" },
                        { datestamp: "updatedAt" }
                    ]
                },
                {
                    metadata: [
                        {
                            "panosc:panosctype": [
                                {
                                    _attr: {
                                        "xmlns:panosc": "http://www.openarchives.org/OAI/2.0/oai_dc/",
                                        "xmlns:dc": "http://purl.org/dc/elements/1.1/",
                                        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                                        "xsi:schemaLocation": "http://www.openarchives.org/OAI/2.0/oai_dc/ " +
                                            "https://raw.githubusercontent.com/panosc-eu/fair-data-api/master/panosc.xsd"
                                    }
                                },
                                { "panosc:id": record[this.collection_id] },
                                { "panosc:name": record.title },
                                { "panosc:description": record.dataDescription },
                                { "panosc:owner": record.creator },
                                { "panosc:contactEmail": record.contactEmail },
                                { "panosc:orcidOfOwner": record.orcidOfOwner },
                                { "panosc:license": record.license },
                                { "panosc:embargoEndDate": record.embargoEndDate },
                                { "panosc:startDate": record.startDate },
                                { "panosc:path": record.path },
                                { "panosc:technique": record.technique },
                                { "panosc:sampleName": record.sampleName },
                                { "panosc:chemicalFormula": record.chemicalFormula },
                                { "panosc:size": record.sizeOfArchive },
                                { "panosc:wavelength": record.wavelength }
                            ]
                        }
                    ]
                }
            ]
        };
        return item;
    };
    ScicatPanoscMapper.prototype.mapOaiDcListRecords = function (records) {
        var list = [];
        var response = {
            ListRecords: []
        };
        for (var _i = 0, records_1 = records; _i < records_1.length; _i++) {
            var record = records_1[_i];
            var item = this.createItemRecord(record);
            list.push(item);
        }
        logger_1.default.debug("Parsed " + list.length + " records into panosc xml format.");
        response.ListRecords = list;
        return response;
    };
    ScicatPanoscMapper.prototype.mapOaiDcGetRecord = function (record) {
        if (!record) {
            throw new Error("Record not found");
        }
        var item = this.createItemRecord(record);
        logger_1.default.debug("Got item with id " + record[this.collection_id] + ", title: " + record.title);
        return item;
    };
    ScicatPanoscMapper.prototype.mapOaiDcListIdentifiers = function (records) {
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
    ScicatPanoscMapper.prototype.mapOaiDcListSets = function (records) {
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
    return ScicatPanoscMapper;
}(core_oai_provider_1.ProviderDCMapper));
exports.ScicatPanoscMapper = ScicatPanoscMapper;
