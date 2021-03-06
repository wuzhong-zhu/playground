var APIKey = require('../models/apikey');
var ConnectionString = require('../models/connection-string');
var UserProfile = require('../models/userprofile')
module.exports = {
  checkAPIKey: function(userid, callbackFn){
    APIKey.find({userid: userid}, function(err, keys){
      callbackFn(err, keys);
    })
  },
  createAPIKey: function(userid, callbackFn){
    var key = new APIKey({userid: userid});
    key.save(function(err){
      callbackFn(err, key);
    })
  },
  getUserFromAPIKey: function(apiKey, callbackFn){
    APIKey.find({api_key: apiKey}).populate('userid').exec(function(err, keys){
      callbackFn(err, keys);
    });
  },
  getConnectionString: function(userid, connectionName, callbackFn){
    ConnectionString.find({userid: userid, connection: connectionName}, function(err, connString){
      callbackFn(err, connString[0]);
    })
  },
  saveConnectionString: function(connectionStringId, userid, connectionName, connectionString, callbackFn){
    var connString = {
      userid: userid,
      connection: connectionName,
      connectionString: connectionString
    };
    if(connectionStringId){
      ConnectionString.update(connectionStringId, connString, {upsert: true},  function(err){
        callbackFn(err);
      })
    }
    else{
      var conn = new ConnectionString(connString);
      conn.save(function(err){
        callbackFn(err);
      });
    }
  },
  updateConnectionString: function(userid, connectionName, data, returnUpdatedDocument, callbackFn){
    ConnectionString.findOneAndUpdate({userid: userid, connection: connectionName}, data, {returnNewDocument: returnUpdatedDocument}, function(err, connectionString){
      if(err){
        callbackFn(err);
      }
      else{
        callbackFn(null, connectionString);
      }
    });
  },
  deleteConnectionString: function(userid, connectionName, callbackFn){
    ConnectionString.find({userid: userid, connection: connectionName}).remove().exec(function(err){
      callbackFn(err);
    });
  },
  getUserConnections: function(userid, callbackFn) {
    ConnectionString.find({userid: userid}, function(err, connections){
      callbackFn(err, connections);
    })
  },
  userVisited: function(userid, callbackFn) {
    UserProfile.findOne({"_id": userid}, function(err, user) {
      if (err) {
        callbackFn(err, null)
      } else if (user.playground_first_visited) {
        callbackFn(null, false)
      } else {
        user.playground_first_visited = new Date()
        user.save(function(saveErr, result) {
          if (saveErr) {
            callbackFn(saveErr, null)
          } else {
            callbackFn(null, true)
          }
        })
      }
    })
  }
}
