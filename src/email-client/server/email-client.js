function email_client() {
    var self = this;
    self.cb = null;
    var Imap = require('imap'),
        inspect = require('util').inspect;
    self.listen = function(cb) {
        self.cb = cb;
        imap.connect();
    }

    var imap = new Imap({
        user: 'emailId',
        password: 'passwd',
        host: 'imap-server',
        port: 993,
        tls: true
    });

    function openInbox(cb) {
        imap.openBox('INBOX', true, cb);
    }

    imap.once('ready', function() {
        openInbox(function(err, box) {
          if (err) throw err;
          var f = imap.seq.fetch('1:3', {
            bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
            struct: true
          });

          f.on('message', function(msg, seqno) {
            // console.log('Message #%d', seqno);
            var prefix = '(#' + seqno + ') ';

            msg.on('body', function(stream, info) {
                var buffer = '';
                stream.on('data', function(chunk) {
                    buffer += chunk.toString('utf8');
                });
                stream.once('end', function() {
                    // console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                    self.cb('mail.msg', {seq:seqno, header: Imap.parseHeader(buffer)});
                });
            });

            msg.once('attributes', function(attrs) {
                // console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
            });

            msg.once('end', function() {
                // console.log(prefix + 'Finished');
            });
          });

          f.once('error', function(err) {
            console.log('Fetch error: ' + err);
            self.cb('mail.error', err);
          });

          f.once('end', function() {
            console.log('Done fetching all messages!');
            imap.end();
            self.cb('mail.end');
          });
        });
    });

    imap.once('error', function(err) {
        console.log(err);
    });

    imap.once('end', function() {
        console.log('Connection ended');
    });
    // var mailOptions = {
    //     from: '"Fred Foo 👥" <foo@blurdybloop.com>', // sender address
    //     to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
    //     subject: 'Hello ✔', // Subject line
    //     text: 'Hello world 🐴', // plaintext body
    //     html: '<b>Hello world 🐴</b>' // html body
    // };

    // send mail with defined transport object
    // transporter.sendMail(mailOptions, function(error, info){
    //     if(error){
    //         return console.log(error);
    //     }
    //     console.log('Message sent: ' + info.response);
    // });
}

module.exports.email_client = email_client;
return email_client();
