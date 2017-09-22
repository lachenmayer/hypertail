# hypertail

> tail(1) for [hypercore](https://github.com/mafintosh/hypercore)

Print the last few blocks of a hypercore feed to stdout, and follow along with updates if you feel like it.

## Example

![Example screenshot](https://hypertail-lachenmayer.hashbase.io/screenshot.png)

The example screenshot shows a [hyperirc](https://github.com/mafintosh/hyperirc) mirror of the #dat IRC channel.

Try it yourself by running:

```
hypertail -f 227d9212ee85c0f14416885c5390f2d270ba372252e781bf45a6b7056bb0a1b5
```

## Usage

```
usage: hypertail [-f] [-n 10] <key>
options:
    -n <number>  The number of blocks to retrieve.
                 Numbers with a leading '+' are relative to the beginning of
                 the input, eg. \`-n +2\` will display all blocks except the
                 first 2, while \`-n 2\` will only display the last 2.
    -f           Wait for live updates. Without this option, hypertail will
                 quit once the end of the feed has been reached.
```

## Install

```
npm install -g hypertail
```

## Dat URL

dat://a68687a7cd38ab628adcf479709e9d0d67a14396b9cc80211ef5db00288fb9e5

## Maintainers

[@lachenmayer](https://github.com/lachenmayer)

## Contribute

PRs accepted.

## License

MIT © 2017 harry lachenmayer
