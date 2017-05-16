const chalk = require('chalk')
const del = require('del')
const download = require('download-git-repo')
const fs = require('fs')
const jsonFormat = require('json-format')
const path = require('path')

function getRepo () {
  return new Promise((resolve, reject) => {
    download('electron/electron', path.join(__dirname, '/'), err => {
      if (err) reject(err)
      else resolve()
    })
  })
}

// console.log(chalk.blue('Destroying previous data...'))
// del(['electron/*', '!electron/parser.js'])
//   .then(() => {
//     console.log(chalk.blue('Downloading electron repo for docs...'))
//     getRepo()
//       .then(() => {
//         console.log(chalk.blue('Cleaning up filebase...'))
//         del(['electron/*', '!electron/parser.js', '!electron/docs', '!electron/docs/*.md'], { dot: true })
//           .then(() => {
//             console.log(chalk.yellow('Begin parsing...'))
//             parse()
//           })
//       })
//   })

function getDocs () {
  let docPaths = fs.readdirSync(path.join(__dirname, '/docs/api'))
  docPaths = docPaths.filter(path => /\.md$/.test(path))
  console.log(chalk.yellow('Files found: '))
  console.log(docPaths.toString().replace(/,/g, ' | '))

  return docPaths
}

function parseFile (file) {
  console.log(chalk.yellow('Parsing: ') + file)
  let rawFile = fs.readFileSync(path.join(__dirname, '/docs/api/', file), 'utf8')

  let moduleName = rawFile.match(/^#\s[a-z0-9]+/gim)
  if (moduleName === null) return null
  moduleName = moduleName[0].replace('# ', '')

  let moduleInstanceEvents = rawFile.match(/Event:\s'.+'(\s_[A-z]+_)?(\s_[A-z]+_)?(\s_[A-z]+_)?/gim)
  if (moduleInstanceEvents !== null && moduleInstanceEvents.length > 0) {
    for (let i = 0; i < moduleInstanceEvents.length; i++) {
      moduleInstanceEvents[i] = moduleInstanceEvents[i].replace(/Event: '|'/g, '')
    }
  }

  let moduleMethods = rawFile.match(/^####?\s`.+`(.+)?$/gim)
  let moduleInstanceMethods = []
  let moduleInstanceProperties = []
  if (moduleMethods !== null && moduleMethods.length > 0) {
    for (let i = 0; i < moduleMethods.length; i++) {
      moduleMethods[i] = moduleMethods[i].replace(/####? `|`/g, '')
    }

    moduleInstanceMethods = moduleMethods.filter(match => !new RegExp(`new|^${moduleName}\.\((.+)?\)`).test(match))
    moduleInstanceProperties = moduleInstanceMethods.filter(match => !/\(|\)/.test(match))
    moduleInstanceMethods = moduleInstanceMethods.filter(match => /\(|\)/.test(match))
    moduleMethods = moduleMethods.filter(match => new RegExp(`new|^${moduleName}\.\((.+)?\)`).test(match))
    for (let i = 0; i < moduleMethods.length; i++) {
      moduleMethods[i] = moduleMethods[i].replace(new RegExp(`^${moduleName}\.`), '')
    }
  }

  let moduleType = rawFile.match(/Process: \[.+\]/)
  if (moduleType !== null) {
    moduleType = moduleType[0].replace(/Process: \[|\]/g, '')
    moduleType = /,/.test(moduleType)
      ? 'both'
      : moduleType.toLowerCase()
  }

  let modulesDescription = rawFile.match(/>.+(\r?\n)/)[0].replace(/>\s+|\r?\n/g, '')

  return {
    moduleName,
    moduleType,
    moduleInstanceEvents,
    moduleMethods,
    moduleInstanceMethods,
    moduleInstanceProperties,
    modulesDescription
  }
}
const allDocs = {}
function parse () {
  let docs = getDocs()

  docs.forEach(doc => {
    let data = parseFile(doc)
    if (data === null) return

    allDocs[data.moduleName] = {
      type: data.moduleType,
      instanceEvents: data.moduleInstanceEvents || [],
      methods: data.moduleMethods || [],
      instanceMethods: data.moduleInstanceMethods || [],
      instanceProperties: data.moduleInstanceProperties || [],
      description: data.modulesDescription
    }

    Object.keys(allDocs).forEach(module => {
      let obj = allDocs[module]
      if (
        obj.instanceEvents.length === 0
        && obj.methods.length === 0
        && obj.instanceMethods.length === 0
        // && obj.instanceProperties.length === 0
      ) {
        delete allDocs[module]
      }
    })
  })

  console.log(chalk.blue('Writing to docs.json...'))
  fs.writeFile(path.join(__dirname) + '/docs.json', jsonFormat(allDocs, { type: 'space', size: 2 }), err => {
    console.log(chalk.green('Done :D !'))
    process.exit()
  })
}

parse()
