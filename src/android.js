const fs = require('fs');
const path = require('path');

// const dir = process.argv[3] || process.cwd();
const dir = process.cwd();
const gradleBuild = path.resolve(dir, 'android/app/build.gradle');
const stringsXml = path.resolve(dir, 'android/app/src/main/res/values/strings.xml');

console.log(`ANDROID: Reading ${gradleBuild}`);
console.log(`ANDROID: Reading ${stringsXml}`);

module.exports = (newID, newName) => {
    return new Promise((resolve, reject) => {
        var changes = {};

        try {
            const markup = fs.readFileSync(gradleBuild, 'utf8');
            const bundleId = markup.match(/applicationId .*?\".*?\"/)[0];

            if (bundleId) {
                console.log(`ANDROID: Found android bundle Id ${bundleId}`);
                changes[gradleBuild] = markup.replace(/applicationId .*?\".*?\"/, `applicationId "${newID}"`);
            } else {
                reject('Could not detect')
            }

        } catch (err) {
            if (err.code === 'ENOENT') {
                reject('Could not read android build gradle, are you sure you are in a react native project?');
            }
        }

        if (newName) {
            try {
                const markup = fs.readFileSync(stringsXml, 'utf8');
                const searchDisplayName = new RegExp("(<string name=\"app_name\">)(.*?)(</string>)", 'm');
                const matchName = markup.match(searchDisplayName);

                if (matchName) {
                    console.log(`ANDROID: Found android display name ${matchName[2]}`);
                    changes[stringsXml] = markup.replace(searchDisplayName, "$1" + newName + "$3");
                } else {
                    reject('ANDROID ERROR: Could not find display name');
                }
            } catch (err) {
                if (err.code === 'ENOENT') {
                    reject('Could not read android strings.xml, are you sure you are in a react native project?');
                }
            }
        }

        resolve(changes);
    })
}
