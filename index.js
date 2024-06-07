import { getClosingPrice } from './helpers.js'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

// https://stackoverflow.com/questions/64383909/dirname-is-not-defined-error-in-node-14-version
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const YEAR = 2023
const STOCKS_TO_CHECK = ['MSFT', 'AAPL']

const prepareFile = (prices) => {
    let keys = ''
    let values = ''

    // Write keys first
    Object.keys(prices).map((key) => {
        const value = prices[key]

        keys += `${key}\n`
        values += `${value}\n`
    })

    return `${keys}\n${values}`
}

const closingPrices = (
    await Promise.all(
        STOCKS_TO_CHECK.map(async (stock) => await getClosingPrice(stock, YEAR))
    )
).reduce((prev, curr, index) => {
    prev[STOCKS_TO_CHECK[index]] = curr

    return prev
}, {})

const file = prepareFile(closingPrices)

console.log(file)

await fs.writeFile(`${__dirname}/output.txt`, file)

console.log('file generated as ./output.txt')
