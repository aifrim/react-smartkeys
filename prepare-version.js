const { writeFileSync, readFileSync } = require('fs')
const prettier = require('prettier')
const semver = require('semver')

const releaseType = process.argv[2]
const preIdentifier = process.argv[3]

if (!releaseType) {
  console.error('Please provide a correct version')
  console.error(
    'E.g.: node prepare-version.js major | minor | patch | premajor | preminor | prepatch | prerelese [--preid string]'
  )
} else {
  const file = './package/package.json'

  const data = readFileSync(file, {
    encoding: 'utf-8'
  })

  const pkg = JSON.parse(data)

  const newVersion = semver.inc(pkg.version, releaseType, false, preIdentifier)
  pkg.version = newVersion

  console.log(newVersion)

  prettier.resolveConfig(file).then((options) => {
    const formatted = prettier.format(JSON.stringify(pkg), {
      ...options,
      parser: 'json-stringify'
    })

    writeFileSync(file, formatted)
  })
}
