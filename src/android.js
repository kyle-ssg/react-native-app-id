const fs = require('fs');
const path = require('path');

const dir = process.argv[3] || process.cwd();
const gradleBuild = path.resolve(dir, 'android/app/build.gradle');


console.log("ANDROID: Reading" + gradleBuild);

module.exports = (newID) => {
    return new Promise((resolve, reject) => {
        var changes = {};

        fs.readFile(gradleBuild, 'utf8', (err, markup) => {
            if (err == null) {
                const bundleId = markup.match(/applicationId .*?\".*?\"/)[0];
                if (bundleId) {
                    console.log("ANDROID: Found android bundle Id", bundleId);
                    changes[gradleBuild] = markup.replace(/applicationId .*?\".*?\"/, 'applicationId "' + newID +'"');
                } else {
                    reject('Could not detect')
                }
                resolve(changes);
            } else {
                reject('Could not read android build gradle, are you sure you are in a react native project?');
            }
        });
    })
}