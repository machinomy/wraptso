#!/usr/bin/env node

import * as yargs from 'yargs'
import Wraptso from '../index'

const args = yargs
  .option('output', {
    describe: 'Folder for generated files',
    alias: 'o'
  })
  .argv

const pattern = args._[0]
const outputDir = args['output']
const wraptso = new Wraptso(pattern, outputDir)

wraptso.run().then(() => {
  process.exit(0)
}).catch(error => {
  console.error(error)
  process.exit(1)
})
