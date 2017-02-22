#!/usr/bin/env node

var newID = process.argv[2];
var _ = require('lodash');
var fs = require('fs');

if (newID && newID.split('.').length <2) {
    console.log("Please type a valid bundle id e.g. com.solidstategroup.myapp");
    return;
}
Promise.all([
    require('./src/ios')(newID),
    require('./src/android')(newID)
])
    .then(function (items) {

        const ios = items[0];
        const android = items[1];

        _.each(ios,(data, location)=> {
            console.log("Writing", location);
            fs.writeFileSync(location,data);
        });

        _.each(android,(data,location)=> {
            console.log("Writing", location);
            fs.writeFileSync(location,data);
        });

    });