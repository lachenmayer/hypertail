# hypertail

> tail(1) for hypercore

Print the last few blocks of a hypercore feed to stdout, and follow along with updates if you feel like it.

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

## Maintainers

[@lachenmayer](https://github.com/lachenmayer)

## Contribute

PRs accepted.

## License

MIT © 2017 harry lachenmayer
