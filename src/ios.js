const fs = require('fs');
const path = require('path');


module.exports = (newID) => {
    return new Promise((resolve, reject) => {


        const srcpath = path.resolve(process.cwd(), 'ios/');

        console.log("Searching for ios directory", srcpath);

        let folders;
        try {
            folders = fs.readdirSync(srcpath)
                .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())

        } catch (e) {
            reject(srcpath, 'directory not found, re you sure you are in a react native project?');
        }


        const folder = folders && folders.find((f) => f.indexOf('.xcodeproj') > -1).replace('.xcodeproj', '');
        const plist = folders && path.resolve(process.cwd(), 'ios/' + folder + '/Info.plist');
        const pbxproj = folders && path.resolve(process.cwd(), 'ios/' + folder + '.xcodeproj/project.pbxproj');
        let changes = {};

        console.log('Reading', plist);
        if (!plist) {
            reject('Are you sure you are in a react native project?');
        }

        fs.readFile(plist, 'utf8', (err, markup) => {
            if (err == null) {
                var searchBundleId = new RegExp('\\$\\(PRODUCT_BUNDLE_IDENTIFIER\\)', 'g');
                if (markup.match(searchBundleId)) {
                    console.log('Found iOS bundle ID', searchBundleId);
                    changes[plist] = markup.replace(searchBundleId, newID);
                }
                resolve(changes);
            } else {
                reject('Are you sure you are in a react native project?');
            }
        });
    })
}
