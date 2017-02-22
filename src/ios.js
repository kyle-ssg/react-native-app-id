const fs = require('fs');
const path = require('path');


module.exports = (newID) => {
    return new Promise((resolve, reject) => {


        const srcpath = path.resolve(process.cwd(), 'ios/');

        console.log("Searching for ios directory", srcpath);

        var folders;
        try {
            folders = fs.readdirSync(srcpath)
                .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())

        } catch (e) {
            reject(srcpath, 'directory not found, re you sure you are in a react native project?');
        }


        const folder = folders && folders.find((f) => f.indexOf('.xcodeproj') > -1).replace('.xcodeproj', '');
        const plist = folders && path.resolve(process.cwd(), 'ios/' + folder + '/Info.plist');
        const pbxproj = folders && path.resolve(process.cwd(), 'ios/' + folder + '.xcodeproj/project.pbxproj');

        console.log('Reading', plist);
        if (!plist) {
            reject('Are you sure you are in a react native project?');
        }

        var changes = {};

        //CFBundleIdentifier


        fs.readFile(pbxproj, 'utf8', (err, markup) => {
            if (err == null) {
                var bundleId = markup.match(/PRODUCT_BUNDLE_IDENTIFIER = (.*?);/);
                if (bundleId) {
                    console.log('Found PRODUCT_BUNDLE_IDENTIFIER', bundleId[1]);
                    changes[pbxproj] = markup.replace(/PRODUCT_BUNDLE_IDENTIFIER = .*?;/g, 'PRODUCT_BUNDLE_IDENTIFIER = ' + newID + ';');


                    //Now that we have the bundle id we can replace everywhere else
                    fs.readFile(plist, 'utf8', (err, markup) => {
                        if (err == null) {

                            var search = new RegExp(bundleId[1], 'g')
                            if (markup.match(search)) {
                                console.log('Found iOS bundle ID', bundleId[1]);
                                changes[plist] = markup.replace(search,  newID );

                                resolve(changes);
                            } else {
                                reject('Could not detect ios app id from plist')
                            }
                        } else {
                            reject('Are you sure you are in a react native project?');
                        }
                    });


                } else {
                    reject('Could not detect ios app id from plist')
                }
            } else {
                reject('Are you sure you are in a react native project?');
            }
        });


    })
}