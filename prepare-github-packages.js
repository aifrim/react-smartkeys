const { writeFileSync, readFileSync } = require('fs')
const prettier = require('prettier')

const name = process.argv[2]

if (!name) {
  console.error('Please provide the new package name')
  console.error('E.g.: node prepare-github-package.js react-smartkeys')
} else {
  const file = './package/package.json'

  const data = readFileSync(file, {
    encoding: 'utf-8'
  })

  const pkg = JSON.parse(data)

  pkg.name = name

  prettier.resolveConfig(file).then((options) => {
    const formatted = prettier.format(JSON.stringify(pkg), {
      ...options,
      parser: 'json-stringify'
    })

    writeFileSync(file, formatted)
  })
}
