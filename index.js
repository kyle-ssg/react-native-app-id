#!/usr/bin/env node

const newID = process.argv[2];
const newName = process.argv[3];
const _ = require('lodash');
const fs = require('fs');

if (newID && newID.split('.').length <2) {
    console.log('Please type a valid bundle id e.g. com.solidstategroup.myapp');
    return;
}

Promise.all([
    require('./src/ios')(newID, newName),
    require('./src/android')(newID, newName)
])
    .then((items) => {

        const ios = items[0];
        const android = items[1];

        _.each(ios, (data, location) => {
            console.log(`Writing ${location}`);
            fs.writeFileSync(location, data);
        });

        _.each(android, (data, location) => {
            console.log(`Writing ${location}`);
            fs.writeFileSync(location, data);
        });

    })
    .catch(e => console.log(e));
