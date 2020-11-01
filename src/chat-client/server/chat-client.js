function chat_client() {
    var self = this;
    var xmpp = require("node-xmpp-client");
    var client;
    var show_values = ['away', 'chat', 'dnd', 'xa'];
    var msg_types = ['chat', 'error', 'groupchat', 'headline', 'normal'];
    var presence_types = ['unavailable', 'subscribe', 'subscribed', 'unsubscribe', 'unsubscribed', 'probe', 'error'];

    var state = show_values[1];
    var jid = 'emailid';
    var pwd = 'passwd';
    var xmpp_server = 'xmpp-server';
    var xmpp_port = 5223;
    var status_msg = 'I am online';

    self.xmpp_connect = function() {
        client = new xmpp({
            jid: jid,
            host: xmpp_server,
            password: pwd,
            port: xmpp_port,
            legacySSL: true,
            reconnect: true,
            credentials: true
        });
    }

    self.set_status = function(state, status_msg) {
        this.state = state;
        this.status_msg = status_msg;
    }

    self.xmpp_send_msg = function(to, msg) {
        console.log('> sending ~ ' + to + ': ' + msg);
        self.xmpp_send_presence(jid, to);
        client.send(new xmpp.Stanza('message', {from:jid, to: to})
            .c('body').t(msg))
    }

    self.xmpp_send_presence = function(from, to, type) {
        client.send(new xmpp.Stanza('presence', {to: to, type: type, from: from})
            .c('show').t(state).up()
            .c('status').t(status_msg))
    }

    self.xmpp_send_iq = function(from, type, qnm) {
        client.send(new xmpp.Stanza('iq', {from: from, type: type})
            .c('query', qnm))
    }

    self.xmpp_listen = function(callback) {
        client.on('online', function() {
            console.log('> online');
            self.xmpp_send_iq(jid, 'get', 'jabber:iq:roster');
            self.xmpp_send_presence();
            callback('xmpp.online');
        })

        client.on('stanza', function(stanza) {
            console.log('> stanza: ', stanza.name)
            callback('xmpp.message', stanza.toJSON());
        })

        client.on('offline', function (e) {
            console.error(e)
            callback('xmpp.offline', e);
        })

        client.on('error', function (e) {
            console.error(e)
            callback('xmpp.error', e);
        })
    }
}
module.exports.chat_client = chat_client;
return chat_client();
