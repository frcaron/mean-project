"use strict";

var Path = require('path');
var app  = require('angular').module('budgetApp');

app.controller('HomeCtrl', require(Path.join('./controllers', 'home')));