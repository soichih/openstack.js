"use strict";

let rp = require("request-promise");
let co = require("co");

let request = (method)=> co.wrap(function* (opts) {
    let url = yield opts.url;
    let token = yield opts.token;
    return rp({method: method,
        url: url,
        headers: {"X-Auth-Token": token.token},
        body: opts.body,
        qs: opts.params,
        json: true});
});

exports.get = request("GET");
exports.del = request("DELETE");
exports.post = request("POST");
exports.put = request("PUT");
exports.patch = request("PATCH");

exports.endpoint = co.wrap(function* (token, service, _interface, region) {
    token = yield token;
    let _service = token.catalog.find((x)=> x.type === service);
    if (!_service)
        throw new Error(`service '${service}' not found in catalog`);

    let endpoint = _service.endpoints.find((ep)=> ep.interface === _interface && (region ? ep.region === region : true));
    if (!endpoint)
        throw new Error(`endpoint not found for '${service}' on interface '${_interface}' in region '${region}'`);
    return endpoint.url;
});