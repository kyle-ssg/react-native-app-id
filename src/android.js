const fs = require('fs');
const path = require('path');
const gradleBuild = path.resolve(process.cwd(), 'android/app/build.gradle');


console.log(gradleBuild);

module.exports = (newID) => {
    return new Promise((resolve, reject) => {
        var changes = {};

        fs.readFile(gradleBuild, 'utf8', (err, markup) => {
            if (err == null) {
                const bundleId = markup.match(/applicationId .*?\".*?\"/)[0];
                if (bundleId) {
                    console.log("Found android bundle Id", bundleId);
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