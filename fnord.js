
var util    = require('util')
  , guid    = require('node-guid')
  , Redis   = require('redis');

var _ = {};

module.exports = _;

_.init = function(params, cb)
{
  cb = cb || function(){};

  _.db = Redis.createClient(params.redis.port, params.redis.host, params.redis.options);

  var onError = function (err) {
    cb(err);
  };

  var onConnect = function (err,res) {

    ///////////////////////////////////
    // now attach the functions to myself.

    _.send = function(evnt){

      var uuid = guid.new();

      if (evnt._session){
        evnt._session = evnt._session + '_';
      }

      _.db.set(['fnordmetric-event-' + uuid, JSON.stringify(evnt)]);
      _.db.expire(['fnordmetric-event-' + uuid,60]);
      _.db.lpush('fnordmetric-queue', uuid);

    };

    _.event = function(eventType, session, eventExtra){
      var evnt = {_type:eventType};
      if (session){
        evnt._session = session;
      }

      for (var itr in eventExtra){
        evnt[itr] = eventExtra[itr];
      }

      _.send(evnt);
    };

    _.pageview = function(url,session){

      var evnt = { _type:"_pageview",
                   url: url};

      if (session){
        evnt._session = session
      }

      _.send(evnt)

    };


    _.set_name = function(name, session){

      var evnt = { _type: "_set_name",
                   name : name,
                   _session: session };

      _.send(evnt);
    }

    _.set_picture = function( image_url, session){
      var evnt =  { _type   : "_set_picture",
                    url     : image_url,
                    _session: session };
      _.send(evnt)

    };


    // and callback the user
    cb(err,res);
  };

  _.db.on('error', onError);
  _.db.on("connect", onConnect);

};
