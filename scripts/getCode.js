// Get code from screeps api.

const request = require('superagent')
const prompt = require('prompt')

console.log('Get Screeps code!')

try {
  const config = require('../configs.json')

  // Use local config file for auth.
  getData(config.username, config.result)
} catch (e) {
  // Get auth from command line input.
  prompt.start()
  prompt.get({
    properties: {
      username: {
        description: 'screeps username',
        type: 'string',
        required: true
      },
      password: {
        description: 'screeps password',
        type: 'string',
        hidden: true,
        replace: '*',
        required: true
      }
    }
  }, (err, result) => {
    if (err) {
      console.log('Invalid input')
      console.error(err)
    } else {
      getData(result.username, result.password)
    }
  })
}

function getData (username, password) {
  console.log('fetching data...')

  request
    .get('https://screeps.com/api/user/code')
    .auth(username, password)
    .then((res) => {
      processData(res.body)
    })
    .catch((err) => {
      console.log('ERROR RETRIEVING CODE')
      console.error(err)
    })
}

function processData (data) {
  console.log('processing data...\n')
  console.log('branch: ' + data.branch)

  const moduleKeys = Object.keys(data.modules)
  console.log(`modules (${moduleKeys.length}):`)

  moduleKeys.forEach((key) => {
    const file = data.modules[key]
    console.log(`  ${key}: ${linesOfCode(file)} LOC`)
    // console.log(file)
  })
}

function linesOfCode (module) {
  return module.split(/\r\n|\r|\n/).length
}
