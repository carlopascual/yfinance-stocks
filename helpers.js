import yahooFinance from 'yahoo-finance2'

export const getClosingPrice = async (ticker, year) => {
    const result = await yahooFinance.historical(ticker, {
        period1: `${year}-12-28`,
        period2: `${year}-12-31`,
    })

    return result[result.length - 1].close
}

export const getOpeningPrice = async (ticker, year) => {
    const result = await yahooFinance.historical(ticker, {
        period1: `${year}-01-01`,
        period2: `${year}-01-04`,
    })

    console.log(result)

    return result[0].open
}
