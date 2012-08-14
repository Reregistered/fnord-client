fnord-client
============

nodejs client module to the great fnordmetric server

https://github.com/paulasmuth/fnordmetric


Example Usage
============

    var fnord     = require('./fnord.js');
    fnord.init(param, function(){ winston.log('Stats ready')});

where param should have 

    param.redis = {port:port, host:host, options:options};


To send an event 

    //fnord example
    fnord.set_name('username',<session>);
    fnord.set_picture(image_url,<session>);
    fnord.send({_type:<event_type>, url:<event_url>, _session:<session>});

Installation
============

npm install fnord-client
