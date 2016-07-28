var express = require('express'),
    router = express.Router(),
    sampleData = require('../configs/sample-data'),
    sampleProjects = require('../configs/sample-projects'),
    dataConnections = require('../configs/data-connections'),
    mongoHelper = require('../controllers/mongo-helper'),
    generalConfig = require('../configs/general'),
    OAuthInfo = require('../configs/oauth-info'),
    Cookie = require('cookie'),
    cookieParser = require('cookie-parser'),
    QRS = require('../controllers/qrs');

router.get('/ticket', function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  QRS.getTicket(req, function(err, ticketResponse){
    console.log('got cookies');
    var cookies = ticketResponse.cookies;
    console.log(cookies);
    if(err){
      res.json({err: err});
    }
    else{
      var parsedCookies = [];
      for (var i=0;i<cookies.length;i++){
        console.log('cookie '+i);
        console.log(cookies[i]);
        var c = Cookie.parse(cookies[i]);
        if(c[process.env.sessionCookieName]){
          cookies[i] = cookies[i].replace('HttpOnly;','').replace('Secure;','');
        }
        parsedCookies.push(cookies[i]);
      }
      console.log('got cookies');
      console.log(ticketResponse.cookies);
      console.log(parsedCookies);
      res.setHeader('Set-Cookie', parsedCookies);
      res.send(JSON.stringify({ticket: ticketResponse.ticket}));
    }
  });
});

module.exports = router;
