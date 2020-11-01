var http = require("http");
//var dispatcher = require('httpdispatcher');
var fs = require('fs');
var url = require("url");
var path = require("path");
var core = require("./app-core.js");
var server = create_http();
listen_http();

function create_http() {
  return http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname;
    var filename = path.join(process.cwd(), uri);
    fs.exists(filename, function(exists) {
      if(!exists) {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not Found\n");
        response.end();
        return;
      }
      
      if (fs.statSync(filename).isDirectory()) filename += '/index.html';

      fs.readFile(filename, "binary", function(err, file) {
        if(err) {
          response.writeHead(500, {"Content-Type": "text/plain"});
          response.write(err + "\n");
          response.end();
          return;
        }

        response.writeHead(200);
        response.write(file, "binary");
        response.end();
      });
    });
  });
}

function listen_http() {
  server.listen(8080, function() {
    console.log("> http-server @ http://localhost:%s", 8080);
  })
}
