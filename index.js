var quickbooks   = require('node-quickbooks');
var request      = require('request');
var qs           = require('querystring');
var http         = require('http');
var config       = require('./config.json');

module.exports = function Qb(cb, sandbox) {

    sandbox = (typeof sandbox !== 'undefined' && sandbox) ? true : false;
    var requestToken;
    var realmId = (sandbox) ? config.REALM_ID_S : config.REALM_ID;
    var consKey = (sandbox) ? config.CONSUMER_KEY_S : config.CONSUMER_KEY;
    var consSec = (sandbox) ? config.CONSUMER_SEC_S : config.CONSUMER_SEC;

    request.post({
        url: 'https://oauth.intuit.com/oauth/v1/get_request_token',
        oauth: {
            callback:        'http://localhost:3000',
            consumer_key:    consKey,
            consumer_secret: consSec,
        }
    }, (e, r, data) => {
        if (e) return cb(e);
        requestToken = qs.parse(data);
        console.log('https://appcenter.intuit.com/Connect/Begin?oauth_token=' + requestToken.oauth_token);
    });

    http.createServer((req, res) => {
        var verToken = qs.parse(req.url);
        res.end('Sucessfully authenticated, you may now close this page.');
        request.post({
            url: 'https://oauth.intuit.com/oauth/v1/get_access_token',
            oauth: {
              consumer_key:    consKey,
              consumer_secret: consSec,
              token:           requestToken.oauth_token,
              token_secret:    requestToken.oauth_token_secret,
              verifier:        verToken.oauth_verifier,
              realmId:         realmId
            }
        }, (e, r, data) => {
            if (e) return cb(e);
            var accessToken = qs.parse(data);
            return cb(null, new quickbooks(consKey, consSec, accessToken.oauth_token, accessToken.oauth_token_secret, realmId, sandbox, true));
        });
    }).listen(3000);
};
