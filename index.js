#!/usr/bin/env node
const hypercore = require('hypercore')
const swarm = require('hyperdiscovery')
const minimist = require('minimist')
const ram = require('random-access-memory')
const through = require('through2')

const argv = minimist(process.argv.slice(2), {
  string: [
    'n' // because we need to parse the '+'
  ],
  boolean: [
    'f',
  ],
  default: {
    'f': false,
    'n': '10',
  }
})

const key = argv._[0]
if (!key) {
  console.log(`tail(1) for hypercore.
Displays the last blocks in a hypercore/hyper*/dat feed.

usage: hypertail [-f] [-n 10] <key>
options:
    -n <number>  The number of blocks to retrieve.
                 Numbers with a leading '+' are relative to the beginning of
                 the input, eg. \`-n +2\` will display all blocks except the
                 first 2, while \`-n 2\` will only display the last 2.
    -f           Wait for live updates. Without this option, hypertail will
                 quit once the end of the feed has been reached.
`)
  process.exit(1)
}

if (argv.n.length < 1) {
  console.error('option requires an argument -- n')
  process.exit(1)
}

const storage = file => ram()
const feed = hypercore(storage, key)

feed.once('ready', () => {
  swarm(feed)

  feed.once('append', () => {
    const live = argv.f
    const n = Number.parseInt(argv.n)
    const start = argv.n[0] === '+' ? n : Math.max(feed.length - Math.abs(n), 0)
    const stream = feed.createReadStream({live, start})
    stream.pipe(process.stdout)
    stream.on('error', err => {
      console.error(err)
      process.exit(1)
    })
    stream.on('end', () => {
      process.exit(0)
    })
  })
})
