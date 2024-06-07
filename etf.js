import { getOpeningPrice, getClosingPrice, getProperty } from './helpers.js'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import STOCKS_TO_CHECK, { YEAR } from './etfs.js'

// https://stackoverflow.com/questions/64383909/dirname-is-not-defined-error-in-node-14-version
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const names = await Promise.all(
    STOCKS_TO_CHECK.map(async (stock) => await getProperty(stock, 'shortName'))
)

const openingPrices = await Promise.all(
    STOCKS_TO_CHECK.map(async (stock) => await getOpeningPrice(stock, YEAR))
)

const closingPrices = await Promise.all(
    STOCKS_TO_CHECK.map(async (stock) => await getClosingPrice(stock, YEAR))
)

const prices = STOCKS_TO_CHECK.reduce((prev, current, index) => {
    prev[current] = {
        name: names[index],
        open: openingPrices[index],
        close: closingPrices[index],
    }

    return prev
}, {})

const prepareFile = (prices) => {
    let file = `REPORTED FOR YEAR ${YEAR}\n\n`

    let keys = ''
    let openings = ''
    let closings = ''
    let names = ''

    // Write keys first
    Object.keys(prices).map((key) => {
        const { open, close, name } = prices[key]

        keys += `${key}\n`
        openings += `${open}\n`
        closings += `${close}\n`
        names += `${name}\n`
    })

    file += `${keys}\n`
    file += `NAMES\n`
    file += `${names}\n`
    file += `OPENING PRICES\n`
    file += `${openings}\n`
    file += `CLOSING PRICES\n`
    file += `${closings}\n`

    return file
}

const file = prepareFile(prices)

console.log(file)

await fs.writeFile(`${__dirname}/etf.txt`, file)

console.log('file generated as ./etf.txt')
