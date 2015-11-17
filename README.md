# NHUBackend

Add API keys to config.json. Any attribute ending in _S applies to a sandbox.

Include and use as follows:
<code>
var backend = require('../nhu_backend');<br/>
<br/>
backend((err, qb) => {<br/>
<br/>
}, true);<br/>
</code>

The callback returns an error, or a quickbooks object from https://github.com/mcohen01/node-quickbooks
The second parameter is optional, true to use the sandbox, false or empty to use production.
