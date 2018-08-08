const fs = require('fs');
const path = require('path');
// const dir = process.argv[3] || process.cwd();
const dir = process.cwd();


module.exports = (newID, newName) => {
    return new Promise((resolve, reject) => {
        const srcpath = path.resolve(dir, 'ios/');
        let folders;

        try {
            folders = fs.readdirSync(srcpath)
                .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())
        } catch (e) {
            reject(`${srcpath} directory not found, are you sure you are in a react native project?`);
        }

        const folder = folders && folders.find((f) => f.indexOf('.xcodeproj') > -1).replace('.xcodeproj', '');
        const plist = folders && path.resolve(dir, `ios/${folder}/Info.plist`);
        const pbxproj = folders && path.resolve(dir, `ios/${folder}.xcodeproj/project.pbxproj`);
        let changes = {};

        console.log(`IOS: Reading ${plist}`);

        if (!plist) {
            reject('Are you sure you are in a react native project?');
        }

        fs.readFile(plist, 'utf8', (err, markup) => {
            if (err) {
                reject('Are you sure you are in a react native project?');
            }

            const searchBundleId = new RegExp("(<key>CFBundleIdentifier</key>\n.*?<string>)(.*?)(</string>)", 'm');
            const searchDisplayName = new RegExp("(<key>CFBundleDisplayName</key>\n.*?<string>)(.*?)(</string>)", 'm');

            const matchId = markup.match(searchBundleId);
            const matchName = markup.match(searchDisplayName);

            if (matchId) {
                if (matchId[2] === '$(PRODUCT_BUNDLE_IDENTIFIER)') {
                    reject('Please move the Bundle ID into the Info.plist for this to work.');
                }

                console.log(`IOS: Found iOS bundle ID ${matchId[2]}`);
                changes[plist] = markup.replace(searchBundleId, "$1" + newID + "$3");
            } else {
                reject('IOS ERROR: Could not find product bundle identifier');
            }

            if (newName) {
                if (matchName) {
                    console.log(`IOS: Found iOS display name ${matchName[2]}`);
                    changes[plist] = changes[plist].replace(searchDisplayName, "$1" + newName + "$3");
                } else {
                    reject('IOS ERROR: Could not find display name');
                }
            }

            resolve(changes);
        });
    })
}
