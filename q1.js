'use strict'

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var router = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var ophones = [
    {name: "Note5" , manufacturer: "Redmi" , price: 9999, quantity: 500000},
    {name: "Note5Pro" , manufacturer: "Redmi" , price: 13999, quantity: 500000},
    {name: "GalaxyA7" , manufacturer: "Samsung" , price: 27999, quantity: 10000},
    {name: "GalaxyA9Pro" , manufacturer: "Samsung" , price: 25999, quantity: 10000},
    {name: "G6Plus" , manufacturer: "Motorola" , price: 17999, quantity: 500000},
    {name: "Z3Play" , manufacturer: "Motorola" , price: 28999, quantity: 100000},
    {name: "9Lite" , manufacturer: "Honor" , price: 15999, quantity: 250000},
    {name: "7X" , manufacturer: "Honor" , price: 13999, quantity: 100000},
    {name: "Mi7" , manufacturer: "Xiaomi" , price: 29999, quantity: 50000},
    {name: "MiA1" , manufacturer: "Xiaomi" , price: 13999, quantity: 100000},
    {name: "Y1" , manufacturer: "Redmi" , price: 8999, quantity: 500000},
    {name: "X4" , manufacturer: "Motorola" , price: 20999, quantity: 40000},
    {name: "X5" , manufacturer: "Motorola" , price: 25999, quantity: 20000},
    {name: "iPhoneSE1" , manufacturer: "Apple" , price: 27999, quantity: 50000},
    {name: "View10" , manufacturer: "Honor" , price: 19999, quantity: 50000},
    {name: "F5Plus" , manufacturer: "Oppo" , price: 24999, quantity: 50000},
    {name: "R7" , manufacturer: "Oppo" , price: 18999, quantity: 50000},
    {name: "A2" , manufacturer: "Xiaomi" , price: 14999, quantity: 2}
];

var phones = ophones;

app.use(function(req , res , next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/get-items' , function(req , res) {
    phones = ophones.slice();
    if (req.query.manufacturer)
        sortman(req);
    if (req.query.name)
        sortmod(req);
    if (req.query['min-price'])
        sortminp(req);
    if (req.query['max-price'])
        sortmaxp(req);
    var jsonResult = JSON.stringify(phones);
    res.set('Content-Type', 'application/json');
    res.send(jsonResult);
})

app.get('/buy' , function(req , res) {
    phones = ophones.slice();
    if (req.query.name) {
        sortmod(req);
        if (phones[0].quantity > 0) {
            var json = {name: req.query.name , price: req.query.price , remainingQty: phones[0].quantity - 1}
            var jsonResult = JSON.stringify(json);
            res.set('Content-Type', 'application/json');
            res.send(jsonResult);
            modifyPhones(req.query.name);
        }
        else {
            var json = {name: req.query.name , error: "Out Of Stock"}
            var jsonResult = JSON.stringify(json);
            res.set('Content-Type', 'application/json');
            res.send(jsonResult);
        }
    }
})

function modifyPhones(name) {
    var i = ophones.length - 1;
    while (i >= 0) {
        if (ophones[i].name.toLowerCase() == name.toLowerCase()) {
            ophones[i].quantity -= 1;
        }
        --i;
    }
}

function removeByAttr (arr, attr, value){
    var i = arr.length;
    while(i--){
       if( arr[i] 
           && arr[i].hasOwnProperty(attr) 
           && (arguments.length > 2 && arr[i][attr] === value ) ){ 

           arr.splice(i,1);
       }
    }
    return arr;
}

function sortmaxp(req) {
    for (var i = 0; i < phones.length; ++i) {
        if (phones[i].price > parseInt(req.query['max-price'])) {
            removeByAttr(phones , 'name' , phones[i].name);
            --i;
        }
    }
}

function sortminp(req) {
    for (var i = 0; i < phones.length; ++i) {
        if (phones[i].price < parseInt(req.query['min-price'])) {
            removeByAttr(phones , 'name' , phones[i].name);
            --i;
        }
    }
}

function sortmod(req) {
    var man = req.query.name;
    man = man.toLowerCase();
    for (var i = 0; i < phones.length; ++i) {
        if (phones[i].name.toLowerCase() != man) {
            removeByAttr(phones , 'name' , phones[i].name);
            --i;
        }
    }
}

function sortman(req) {
    var man = req.query.manufacturer;
    man = man.toLowerCase();
    for (var i = 0; i < phones.length; ++i) {
        if (phones[i].manufacturer.toLowerCase() != man) {
            removeByAttr(phones , 'name' , phones[i].name);
            --i;
        }
    }
}

app.listen(9999, function (err) {
    if (err) {
      throw err
    }
    console.log('Server started on port 9999');
})
