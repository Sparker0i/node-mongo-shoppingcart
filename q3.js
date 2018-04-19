'use strict'

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var router = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var ophones = [
    {model: "Note5" , manufacturer: "Redmi" , price: 9999, quantity: 500000},
    {model: "Note5Pro" , manufacturer: "Redmi" , price: 13999, quantity: 500000},
    {model: "GalaxyA7" , manufacturer: "Samsung" , price: 27999, quantity: 10000},
    {model: "GalaxyA9Pro" , manufacturer: "Samsung" , price: 25999, quantity: 10000},
    {model: "G6Plus" , manufacturer: "Motorola" , price: 17999, quantity: 500000},
    {model: "Z3Play" , manufacturer: "Motorola" , price: 28999, quantity: 100000},
    {model: "9Lite" , manufacturer: "Honor" , price: 15999, quantity: 250000},
    {model: "7X" , manufacturer: "Honor" , price: 13999, quantity: 100000},
    {model: "Mi7" , manufacturer: "Xiaomi" , price: 29999, quantity: 50000},
    {model: "MiA1" , manufacturer: "Xiaomi" , price: 13999, quantity: 100000},
    {model: "Y1" , manufacturer: "Redmi" , price: 8999, quantity: 500000},
    {model: "X4" , manufacturer: "Motorola" , price: 20999, quantity: 40000},
    {model: "X5" , manufacturer: "Motorola" , price: 25999, quantity: 20000},
    {model: "iPhoneSE1" , manufacturer: "Apple" , price: 27999, quantity: 50000},
    {model: "View10" , manufacturer: "Honor" , price: 19999, quantity: 50000},
    {model: "F5Plus" , manufacturer: "Oppo" , price: 24999, quantity: 50000},
    {model: "R7" , manufacturer: "Oppo" , price: 18999, quantity: 50000},
    {model: "MiA2" , manufacturer: "Xiaomi" , price: 14999, quantity: 2}
];

var oprices = [];

var salesrecord = [];
var phones;

const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const num = '0123456789'

function randa() {
    return Math.floor(Math.random() * 26);
}

function randn() {
    return Math.floor(Math.random() * 10);
}

app.use(function(req , res , next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/get-items' , function(req , res) {
    phones = ophones.slice();
    if (req.query.manufacturer)
        sortman(req);
    if (req.query.model)
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
    var user = req.query.username;
    var model = req.query.model;
    var qty = req.query.qty;
    qty = parseInt(qty);
    if (req.query.model) {
        sortmod(req);
        if (phones[0].qtyOnSale) {
            if (phones[0].qtyOnSale - qty >= 0) {
                phones[0].qtyOnSale -= qty;
                ophones[getOriginalPhonePosition(phones[0].model)].qtyOnSale = phones[0].qtyOnSale;
                var json = modifyPhones(req.query.model , user , qty , '-' , true);
                var jsonResult = JSON.stringify(json);
                res.set('Content-Type', 'application/json');
                res.send(jsonResult);
                if (phones[0].qtyOnSale == 0) {
                    ophones[getOriginalPhonePosition(phones[0].model)].price = oprices[getOriginalPhonePosition(phones[0].model)];
                    phones[0].price = oprices[getOriginalPhonePosition(phones[0].model)];
                }
            }
            else if (phones[0].qtyOnSale == 0) {
                console.log(getOriginalPhonePosition(phones[0].model));
                var json = modifyPhones(req.query.model , user , qty , '-' , true);
                var jsonResult = JSON.stringify(json);
                res.set('Content-Type', 'application/json');
                res.send(jsonResult);
            }
            else {
                var json = {model: req.query.model , error: "Quantity demanded More than available stock for special price"}
                var jsonResult = JSON.stringify(json);
                res.set('Content-Type', 'application/json');
                res.send(jsonResult);    
            }
        }
        else {
            if (phones[0].quantity > 0 && phones[0].quantity - qty > 0) {
                var json = modifyPhones(req.query.model , user , qty , '-')
                var jsonResult = JSON.stringify(json);
                res.set('Content-Type', 'application/json');
                res.send(jsonResult);
            }
            else {
                var json = {model: req.query.model , error: "Out Of Stock"}
                var jsonResult = JSON.stringify(json);
                res.set('Content-Type', 'application/json');
                res.send(jsonResult);
            }
        }
    }
    else {
        var json = {model: req.query.model , error: "Invalid Phone Details"}
        var jsonResult = JSON.stringify(json);
        res.set('Content-Type', 'application/json');
        res.send(jsonResult);
    }
})

app.get('/getSalesRecords' , function(req , res) {
    var jsonResult = JSON.stringify(salesrecord);
    res.set('Content-Type', 'application/json');
    res.send(jsonResult);
})

app.get('/return' , function(req , res) {
    phones = ophones.slice();
    var flag = 1;
    var invoice = req.query.invoiceNumber;
    for (var i = 0; i < salesrecord.length; ++i) {
        if (salesrecord[i].invoiceNumber == invoice) {
            flag = 0;
            if (salesrecord[i].boughtInSale) {
                var json = {model: req.query.model , error: "Bought In Sale, Cannot Be Returned"}
                var jsonResult = JSON.stringify(json);
                res.set('Content-Type', 'application/json');
                res.send(jsonResult);
            }
            else {
                salesrecord[i].returned = true;
                modifyPhones(salesrecord[i].model , salesrecord[i].customer , salesrecord[i].quantity , '+')
                res.set('Content-Type', 'application/json');
                res.send(salesrecord[i]);
            }
        }
    }
    if (flag == 1) {
        var json = {error: "Invalid Invoice Number"}
        var jsonResult = JSON.stringify(json);
        res.set('Content-Type', 'application/json');
        res.send(jsonResult);
    }
})

app.get('/start-deal' , function(req , res) {
    var price = parseInt(req.query.price);
    var qty = parseInt(req.query.quantity);
    var time = parseInt(req.query.time);
    var model = req.query.model;
    model = model.toLowerCase();
    for (var i = 0; i < ophones.length; ++i) {
        if (model.toLowerCase() == ophones[i].model.toLowerCase()) {
            var pos = getOriginalPhonePosition(model);
            var op = getOriginalPhone(model).price;
            oprices[pos] = op;
            console.log(oprices);
            setTimeout(function() {
                ophones[i].price = op;
                delete ophones[i].qtyOnSale;
                console.log("Sales Timed Out")
            } , time * 1000);
            ophones[i].price = price;
            ophones[i].qtyOnSale = qty;
            break;
        }
    }
    res.send("");
})

function generateInvoice() {
    var model = '';
    
    model += alpha[randa()];
    model += alpha[randa()];
    model += num[randn()];
    model += num[randn()];
    model += num[randn()];
    if (invoiceExists(model)) 
        return generateInvoice();
    else
        return model;
}

function invoiceExists(model) {
    for (var i = 0; i < salesrecord.length; ++i) {
        if (salesrecord[i].invoiceNumber == model)
            return true;
    }
    return false;
}

function modifyPhones(model , user , qty , op , onsale) {
    var i = ophones.length - 1;
    onsale = typeof onsale !== 'undefined' ? onsale : false;
    if (op == '-') {
        while (i >= 0) {
            if (ophones[i].model.toLowerCase() == model.toLowerCase()) {
                ophones[i].quantity -= qty;
                break;
            }
            --i;
        }
        var json = {model: model, quantity: qty , customer: user, invoiceNumber: generateInvoice()};
        if (onsale)
            json.boughtInSale = true;
        salesrecord.push(json);
        console.log(salesrecord);
    }
    else if (op == '+') {
        while (i >= 0) {
            if (ophones[i].model.toLowerCase() == model.toLowerCase()) {
                ophones[i].quantity += qty;
                break;
            }
            --i;
        }
        console.log(salesrecord);
    }
    return json;
}

function getOriginalPhone(model) {
    for (var i = 0; i < ophones.length; ++i) {
        if (ophones[i].model.toLowerCase() == model.toLowerCase()) {
            return ophones[i];
        }
    }
}

function getOriginalPhonePosition(model) {
    console.log("Ophones Length " + ophones.length)
    for (var i = 0; i < ophones.length; ++i) {
        if (ophones[i].model.toLowerCase() == model.toLowerCase()) {
            return i;
        }
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
            removeByAttr(phones , 'model' , phones[i].model);
            --i;
        }
    }
}

function sortminp(req) {
    for (var i = 0; i < phones.length; ++i) {
        if (phones[i].price < parseInt(req.query['min-price'])) {
            removeByAttr(phones , 'model' , phones[i].model);
            --i;
        }
    }
}

function sortmod(req) {
    var man = req.query.model;
    man = man.toLowerCase();
    for (var i = 0; i < phones.length; ++i) {
        if (phones[i].model.toLowerCase() != man) {
            removeByAttr(phones , 'model' , phones[i].model);
            --i;
        }
    }
}

function sortman(req) {
    var man = req.query.manufacturer;
    man = man.toLowerCase();
    for (var i = 0; i < phones.length; ++i) {
        if (phones[i].manufacturer.toLowerCase() != man) {
            removeByAttr(phones , 'model' , phones[i].model);
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