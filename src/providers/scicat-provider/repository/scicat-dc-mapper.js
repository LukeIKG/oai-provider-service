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
exports.ScicatDcMapper = void 0;
var logger_1 = require("../../../server/logger");
var core_oai_provider_1 = require("../../core/core-oai-provider");
var ScicatDcMapper = /** @class */ (function (_super) {
    __extends(ScicatDcMapper, _super);
    function ScicatDcMapper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.route = process.env.SCICAT_ROUTE || "/scicat/oai";
        return _this;
    }
    /**
     * The Universal Coordinated Time (UTC) date needs to be modifed
     * to match the local timezone.
     * @param record the raw data returned by the mongo dao query
     * @returns {string}
     */
    ScicatDcMapper.prototype.setTimeZoneOffset = function (record) {
        var date = new Date(record.registeredTime ? record.registeredTime : null);
        var timeZoneCorrection = new Date(date.getTime() + date.getTimezoneOffset() * -60000);
        timeZoneCorrection.setMilliseconds(0);
        return timeZoneCorrection.toISOString().split('.')[0] + "Z";
    };
    ScicatDcMapper.prototype.getRightsMessage = function (restricted) {
        if (restricted) {
            return "Restricted to University users.";
        }
        return "Available to the public.";
    };
    ScicatDcMapper.prototype.createItemRecord = function (record) {
        var updatedAt = this.setTimeZoneOffset(record);
        var item = {
            record: [
                {
                    'header': [
                        { 'identifier': record[this.collection_id] },
                        { 'datestamp': updatedAt }
                    ]
                },
                {
                    'metadata': [
                        {
                            'oai_dc:dc': [{
                                    '_attr': {
                                        'xmlns:oai_dc': 'http://www.openarchives.org/OAI/2.0/oai_dc/',
                                        'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
                                        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                                        'xsi:schemaLocation': 'http://www.openarchives.org/OAI/2.0/oai_dc/ ' +
                                            'http://www.openarchives.org/OAI/2.0/oai_dc.xsd'
                                    }
                                },
                                { 'dc:title': record.title },
                                { 'dc:description': record.dataDescription },
                                { 'dc:identifier': record[this.collection_id] },
                                { 'dc:identifier': process.env.BASE_URL +
                                        "/detail/" + encodeURIComponent(record[this.collection_id]) },
                                { 'dc:date': record.publicationYear },
                                { 'dc:creator': record.creator },
                                { 'dc:type': "dataset" },
                                { 'dc:publisher': record.publisher },
                                { 'dc:rights': this.getRightsMessage(false) },
                            ],
                        }
                    ]
                }
            ]
        };
        return item;
    };
    ScicatDcMapper.prototype.mapOaiDcListRecords = function (records) {
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
    ScicatDcMapper.prototype.mapOaiDcGetRecord = function (record) {
        if (!record) {
            throw new Error("Record not found");
        }
        var item = this.createItemRecord(record);
        logger_1.default.debug("Got item with id " + record[this.collection_id] + ", title: " + record.title);
        return item;
    };
    ScicatDcMapper.prototype.mapOaiDcListIdentifiers = function (records) {
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
    ScicatDcMapper.prototype.mapOaiDcListSets = function (records) {
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
    return ScicatDcMapper;
}(core_oai_provider_1.ProviderDCMapper));
exports.ScicatDcMapper = ScicatDcMapper;
