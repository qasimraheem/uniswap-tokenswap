let request = require('request');
const {ChainId, Token, WETH, Fetcher, Route, UNISWAP, TradeType, TokenAmount, Trade} = require('@uniswap/sdk');
// const {getAddress, isAddress, getIcapAddress, getContractAddress, getCreate2Address} = require("@ethersproject/address");
let Web3 = require('web3');

function options(address) {
    return {
        method: 'POST',
        uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': '__cfduid=dd56c2bc8d09d252ff244e1e6d94e31fa1614345297'
        },
        body: JSON.stringify({
            query: `{
              token(id: "${address}") {
                id
                name
                symbol
              }
            }`,
            variables: {}
        })
    }
}

(async () => {
    let web3 = new Web3('https://mainnet.infura.io/v3/a3f4dff0483a48ebaec64b896445c146');
    console.log(`The chainId of mainnet is ${ChainId.MAINNET}.`)
    let address = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    let addressCheckSum = web3.utils.toChecksumAddress(address);
    const DAI = new Token(ChainId.MAINNET, addressCheckSum, 18)


//     request(options(address), function (error, response) {
//         if (error) throw new Error(error);
//         console.log(response.body);
//     });
    const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId])

    const route = new Route([pair], WETH[DAI.chainId])

    const trade = new Trade(route, new TokenAmount(WETH[DAI.chainId], '2'), TradeType.EXACT_INPUT)

    console.log(trade.executionPrice.toSignificant(6))
    console.log(trade.nextMidPrice.toSignificant(6))
    console.log(trade.outputAmount.toSignificant(6))
    console.log("trade:",trade)
})()
