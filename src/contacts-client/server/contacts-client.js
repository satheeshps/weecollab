function contacts_client() {
    //125.22.47.125
    //125.22.47.100
    self = this;
    var ldap = require('ldapjs');
    var client = ldap.createClient({url: 'ldap://oradev.oraclecorp.com:1389'});

    this.connect = function() {
        client.bind('cn=root', 'secret', function(err) {
        });
    },
    this.search = function() {
        var opts = {
            filter: '(&(l=Seattle)(email=*@foo.com))',
            scope: 'sub',
            attributes: ['dn', 'sn', 'cn']
        };

        client.search('o=example', opts, function(err, res) {
            res.on('searchEntry', function(entry) {
                console.log('entry: ' + JSON.stringify(entry.object));
            });

            res.on('searchReference', function(referral) {
                console.log('referral: ' + referral.uris.join());
            });

            res.on('error', function(err) {
                console.error('error: ' + err.message);
            });

            res.on('end', function(result) {
                console.log('status: ' + result.status);
            });
        });
    },
    this.disconnect = function() {
        client.unbind(function(err) {
            assert.ifError(err);
        });
    }
}
module.exports.contacts_client = contacts_client;
return contacts_client();