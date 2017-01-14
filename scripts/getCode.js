// Get code from screeps api.

const request = require('superagent')
const prompt = require('prompt')
const child_process = require('child_process')
const fs = require('fs')

console.log('Get Screeps code!')

try {
  const config = require('../config.json')

  // Use local config file for auth.
  getData(config.username, config.password)
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
    const module = data.modules[key]
    console.log(`  ${key}: ${linesOfCode(module)} LOC`)
  })
  console.log('')

  if (checkForMatchingBranch(data.branch) && !checkForDirtyBranch()) {
    writeModules(data.modules)
  }
}

function getCurrentBranch() {
  let currentBranch = child_process.execSync('git symbolic-ref HEAD')
    .toString()
  currentBranch = currentBranch.trim().match(/\w+$/)[0]
  return currentBranch
}

function checkForMatchingBranch (branch) {
  const expectedBranch = branch === 'default' ? 'master' : branch
  let currentBranch = getCurrentBranch()

  const matchingBranch = expectedBranch === currentBranch

  if (!matchingBranch) {
    console.log('You are not on a matching branch.')
    console.log(`You are on branch ${currentBranch}.`)
    console.log(`Switch to branch ${expectedBranch} and try again.`)
  } else {
    console.log(`You are on the matching branch ${expectedBranch}.`)
  }

  return matchingBranch
}

function checkForDirtyBranch () {
  let dirtyBranch = child_process.execSync('git status --porcelain')
      .toString()
  dirtyBranch = dirtyBranch.length > 0

  if (dirtyBranch) {
    console.log('You have unsaved changes in your branch.')
    console.log('Commit or stash your changes before updating from screeps.')
  }

  return dirtyBranch
}

function writeModules (modules) {
  const srcDir = 'src'
  console.log('')
  console.log(`writing modules to ${srcDir} dir...`)

  const moduleKeys = Object.keys(modules)
  moduleKeys.forEach((key) => {
    const module = modules[key]
    console.log(`writing ${key} (${linesOfCode(module)} LOC)...`)
    const filename = `${srcDir}/${key}.js`

    fs.writeFileSync(filename, module)
  })
}

function linesOfCode (module) {
  return module.split(/\r\n|\r|\n/).length
}
