const test = require('tape')
const execa = require('execa')
const hypercore = require('hypercore')
const swarm = require('hyperdiscovery')
const pify = require('pify')
const ram = require('random-access-memory')

const data = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
]

function getFeed () {
  return new Promise((resolve, reject) => {
    const feed = hypercore(file => ram())
    const append = pify(feed.append).bind(feed)
    feed.on('ready', async () => {
      for (let line of data) {
        await append(line)
      }
      swarm(feed)
      resolve(feed)
    })
  })
}

test('error with no key', async t => {
  try {
    const result = await execa('node', ['index.js'])
  } catch (e) {
    t.pass('it errors')
  }
  t.end()
})

test('error with empty -n', async t => {
  const feed = await getFeed()
  const key = feed.key.toString('hex')
  try {
    const result = await execa('node', ['index.js', key, '-n'])
  } catch (e) {
    t.pass('it errors')
  }
  t.end()
})

test('no arguments prints last 10 items', async t => {
  const feed = await getFeed()
  const key = feed.key.toString('hex')
  const result = await execa('node', ['index.js', key])
  t.equal(result.stdout, 'threefourfivesixseveneightnineteneleventwelve')
  t.end()
})

test('-n 3 prints last 3 items', async t => {
  const feed = await getFeed()
  const key = feed.key.toString('hex')
  const result = await execa('node', ['index.js', key, '-n', '3'])
  t.equal(result.stdout, 'teneleventwelve')
  t.end()
})

test('-n -3 prints last 3 items', async t => {
  const feed = await getFeed()
  const key = feed.key.toString('hex')
  // `-n -3` gets interpreted as two params, n and 3...
  const result = await execa('node', ['index.js', key, '-n=-3'])
  t.equal(result.stdout, 'teneleventwelve')
  t.end()
})

test('-n +9 prints everything except first 9 items', async t => {
  const feed = await getFeed()
  const key = feed.key.toString('hex')
  const result = await execa('node', ['index.js', key, '-n', '+9'])
  t.equal(result.stdout, 'teneleventwelve')
  t.end()
})

test('-f follows', async t => {
  const feed = await getFeed()
  const key = feed.key.toString('hex')
  const start = data.length - 9 // last 10 items are shown by default
  const expectedOutput = data.slice(start, data.length).join('') + 'thirteen'
  const result = execa('node', ['index.js', key, '-f'])
  let actualOutput = ''
  result.stdout.on('data', x => {
    actualOutput += x.toString()
    if (actualOutput === expectedOutput) {
      t.pass('chunk added after starting is printed as expected')
      result.kill()
      t.end()
    }
  })
  feed.append('thirteen')
})
