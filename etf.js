import { getOpeningPrice, getClosingPrice } from './helpers.js'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import yahooFinance from 'yahoo-finance2'

// https://stackoverflow.com/questions/64383909/dirname-is-not-defined-error-in-node-14-version
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const YEAR = 2023

const STOCKS_TO_CHECK = ['NAS.OL', 'ARKF', 'ARKK']

const openingPrices = await Promise.all(
    STOCKS_TO_CHECK.map(async (stock) => await getOpeningPrice(stock, YEAR))
)

const closingPrices = await Promise.all(
    STOCKS_TO_CHECK.map(async (stock) => await getClosingPrice(stock, YEAR))
)

const prices = STOCKS_TO_CHECK.reduce((prev, current, index) => {
    prev[current] = {
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

    // Write keys first
    Object.keys(prices).map((key) => {
        const { open, close } = prices[key]

        keys += `${key}\n`
        openings += `${open}\n`
        closings += `${close}\n`
    })

    file += `${keys}\n`
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
