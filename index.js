#!/usr/bin/env node

const newID = process.argv[2]
const newName = process.argv[3]
const option = process.argv[4]
const onlyIos = option === "--ios"
const onlyAndroid = option === "--android"
const _ = require('lodash')
const fs = require('fs')

const help = () => {
    console.log("USAGE: react-native-app-id IDENTIFIER NAME [--ios/--android]")
    console.log("")
    console.log("  IDENTIFIER: example: com.solidstategroup.myapp")
    console.log("  NAME: example. MyApp")
    console.log("  --ios: Only updates the iOS app")
    console.log("  --android: Only updates the Android app")
}

if (option && !onlyIos && !onlyAndroid) {
    console.log("option must be empty or --ios or --android")
    console.log("")
    help()
    return
}

if (newID && newID.split('.').length < 2) {
    help()
    return
}

const process = (iosOrAndroid) => {
    _.each(iosOrAndroid, (data, location) => {
        console.log(`Writing ${location}`)
        fs.writeFileSync(location, data)
    })
}

const requires = []

if (onlyIos) {
    require('./src/ios')(newID, newName).then(process).catch(console.error)
} else if (onlyAndroid) {
    require('./src/android')(newID, newName).then(process).catch(console.error)
} else {
    require('./src/ios')(newID, newName).then(process).catch(console.error)
    require('./src/android')(newID, newName).then(process).catch(console.error)
}
