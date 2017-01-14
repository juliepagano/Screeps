// Get code from screeps api.

const request = require('superagent')
const prompt = require('prompt')
const child_process = require('child_process')
const fs = require('fs')
const argv = require('yargs')
  .option('f', {
    description: 'if specified, will ignore git status check and force update'
  })
  .argv

console.log('Set Screeps code!')

const force = !!argv.f

try {
  const config = require('../config.json')

  // Use local config file for auth.
  setData(config.username, config.password, force)
} catch (e) {
  console.log(e)

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
      setData()(result.username, result.password, force)
    }
  })
}

function setData (username, password, force) {
  const modules = readModules()
  const currentBranch = getCurrentBranch()
  const screepsBranch = currentBranch === 'master' ? 'default' : currentBranch

  const data = {
    branch: screepsBranch,
    modules: modules
  }

  if (!checkForDirtyBranch(force)) {
    console.log('')
    console.log(`sending data to branch ${screepsBranch}...`)
    request
      .post('https://screeps.com/api/user/code')
      .auth(username, password)
      .send(data)
      .then((res) => {
        if (res.body && res.body.ok) {
          console.log('Successful update!')
        } else {
          console.log('No "ok" response. Something probably went wrong.')
        }
      })
      .catch((err) => {
        console.log('ERROR UPDATING CODE')
        console.error(err)
      })
  }
}

function getCurrentBranch(force) {
  let currentBranch = child_process.execSync('git symbolic-ref HEAD')
    .toString()
  currentBranch = currentBranch.trim().match(/[A-Za-z0-9_\-]+$/)[0]
  return currentBranch
}

function checkForDirtyBranch (force) {
  let dirtyBranch = child_process.execSync('git status --porcelain')
      .toString()
  dirtyBranch = dirtyBranch.length > 0

  if (dirtyBranch) {
    console.log('You have unsaved changes in your branch.')

    if (force) {
      console.log('You have specified -f, so updating anyway.')
      dirtyBranch = false
    } else {
      console.log('Commit or stash your changes before updating from screeps.')
    }
  }

  return dirtyBranch
}

function readModules () {
  const srcDir = 'src'
  console.log('')
  console.log(`reading modules from ${srcDir} dir...`)

  const files = fs.readdirSync(srcDir).filter((file) => {
    // Check for .js files
    return file.match(/\.js$/)
  })

  let modules = {}
  files.forEach((file) => {
    const moduleName = file.replace(/\.js/,'')
    const data = fs.readFileSync(`${srcDir}/${file}`).toString()
    modules[moduleName] = data

    console.log(`reading ${moduleName} (${linesOfCode(data)} LOC)...`)
  })

  return modules
}

function linesOfCode (module) {
  return module.split(/\r\n|\r|\n/).length
}
