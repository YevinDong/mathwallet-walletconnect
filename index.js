import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import { configureChains, createConfig, getWalletClient, getAccount } from '@wagmi/core'
import { arbitrum, mainnet, polygon } from '@wagmi/core/chains'
const chains = [arbitrum, mainnet, polygon]
const projectId = 'e6454bd61aba40b786e866a69bd4c5c6'

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, chains }),
    publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)
const web3modal = new Web3Modal({ projectId }, ethereumClient)
const log = document.getElementById("log");

document.getElementById('walletConnect').addEventListener('click', () => {
    web3modal.openModal()
})

document.getElementById('signTypedData').addEventListener('click', async () => {
    const wallet = await getWalletClient()
    const account = await getAccount();
    const msgParams = {
        "domain": {
            "name": "Cassava",
            "version": "1"
        },
        "primaryType": "Challenge",
        "types": {
            "EIP712Domain": [
                {
                    "name": "name",
                    "type": "string"
                },
                {
                    "name": "version",
                    "type": "string"
                }
            ],
            "Challenge": [
                {
                    "name": "address",
                    "type": "address"
                },
                {
                    "name": "nonce",
                    "type": "string"
                },
                {
                    "name": "timestamp",
                    "type": "string"
                }
            ]
        },
        "message": {
            "address": account.address,
            "nonce": "1110",
            "timestamp": `${Math.floor(Date.now() / 1000)}`
        }
    }
    try{
        let result = await wallet.signTypedData(msgParams);
        log.innerHTML += `<p>result: ${JSON.stringify(result)}</p>`
    }catch(e){
        log.innerHTML += `<p>error: ${JSON.stringify(e)}</p>`
    }
    console.log('result: ', result);
})