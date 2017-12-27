// Finite Automata server
// Setup all required packages
'use strict';
var express = require("express");
var bodyParser = require("body-parser");
// create an express server to make a static file server
var app = express();
// initialize global information, if any exists

// if the express server is contacted, look at the request and build a response or
// forward the request to the standard server behavior.
app.use(bodyParser.urlencoded({extended: true}));
app.get("*", function(request, response, next) {
    console.log("fell into default get");
    console.log(request.url);
    console.log(request.method);
    next();
  });
app.post("*", function(request, response, next) {
    console.log("fell into default post");
    console.log(request.url);
    console.log(request.method);
    next();
  });
app.use(express.static("./"));
var server = app.listen(process.env.PORT || 3001);


console.log("Finite Automata server is listening");
