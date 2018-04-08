const fs = require('fs');
const path = require('path');
const dir = process.argv[3] || process.cwd();


module.exports = (newID) => {
    return new Promise((resolve, reject) => {


        const srcpath = path.resolve(dir, 'ios/');


        let folders;
        try {
            folders = fs.readdirSync(srcpath)
                .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())

        } catch (e) {
            reject(srcpath, 'directory not found, re you sure you are in a react native project?');
        }


        const folder = folders && folders.find((f) => f.indexOf('.xcodeproj') > -1).replace('.xcodeproj', '');
        const plist = folders && path.resolve(dir, 'ios/' + folder + '/Info.plist');
        const pbxproj = folders && path.resolve(dir, 'ios/' + folder + '.xcodeproj/project.pbxproj');
        let changes = {};

        console.log('IOS: Reading', plist);
        if (!plist) {
            reject('Are you sure you are in a react native project?');
        }

        fs.readFile(plist, 'utf8', (err, markup) => {
            if (err == null) {
                var searchBundleId = new RegExp("(<key>CFBundleIdentifier</key>\n.*?<string>)(.*?)(</string>)", 'm');
                var match = markup.match(searchBundleId);

                if (match) {
                    console.log('IOS: Found iOS bundle ID', match[2]);
                    changes[plist] = markup.replace(searchBundleId, "$1"+newID+"$3");
                } else {
                    console.log("IOS ERROR: Could not find product bundle identifier");
                }
                resolve(changes);
            } else {
                reject('Are you sure you are in a react native project?');
            }
        });
    })
}
