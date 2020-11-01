var fs = require('fs');
var url = require("url");
var path = require("path");
var ws = require('ws').Server;
var xmpp = require("./src/chat-client/server/chat-client.js");
var email = require("./src/email-client/server/email-client.js");
var cli = new xmpp.chat_client();
var mail_cli = new email.email_client();

var wsclient;
var queue = [];
var mail_queue = [];

var wss = connect_ws();
listen_ws();

mail_cli.listen(function(type, data){
  switch(type) {
    case 'mail.msg':
      console.log('New message: ' + data.header.from);
      mail_queue.push(data);
      flush(mail_queue);
    break;
    case 'mail.error':
      console.log('Mail error: ' + data);
      break;
    case 'mail.end':
      console.log('Mail end: ');
      break;
  }
});
cli.xmpp_connect();
cli.xmpp_listen(function(type, data) {
  switch(type) {
    case 'xmpp.online':
      console.log('> xmpp connection online');
      break;
    case 'xmpp.offline':
      console.log('> xmpp connection offline');
      break;
    case 'xmpp.onerror':
      console.log('> xmpp connection error');
      break;
    case 'xmpp.message':
        console.log('> queued data');
        queue.push(data);
        flush(queue);
      break;
  }
});

function connect_ws() {
  return new ws({port: 8989});
}

function flush(q) {
  if(wsclient) {
    console.log('> flush data upstream');
    while((item = q.pop()) != null) {
      console.log('> flush data: ' + item.name + ' > '+ JSON.stringify(item));
      ws_send(JSON.stringify(item));
    }
  }
}

function listen_ws() {
  wss.on('connection', function(ws) {
    console.log('> ws-connect');
    wsclient = ws;
    flush(queue);
    flush(mail_queue);
    ws.on('message', function(message) {
      console.log('> incoming message');
      var json = JSON.parse(message);
      cli.xmpp_send_msg(json.to, json.msg);
    });
  });
}

function ws_send(msg) {
  wsclient.send(msg);
}
