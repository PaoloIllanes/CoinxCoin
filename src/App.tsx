import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {connectWallet, initialize} from "./ethereum/web3";
//import contractLottery from "./ethereum/abis/Lottery.json"
import contractLottery from "./ethereum-hardhat/artifacts/src/ethereum-hardhat/contracts/Main.sol/Main.json"
function App() {

    const [contractDeployed, setContract] = useState<any>('');
    const [address, setAddress] = useState<any>('');
    const [quantity, setQuantity] = useState<any>('');
    const [balance, setBalance] = useState<any>('');
    const [userBalance, setUserBalance] = useState<any>('');
    const [tokens, setTokens] = useState<any>('');
    const [value, setValue] = useState<any>('');
    const [contractAddress, setContractAddress] = useState<any>('');
    const [tokenprice, setTokenPrice] = useState<any>('');



    useEffect( () => {
        // @ts-ignore
        if(window.web3) {
            initialize();
            loadBlockchainData();
        }
    }, [])

    const loadBlockchainData = async () => {
        // @ts-ignore
        const Web3 = window.web3;
        const abi = contractLottery.abi;
        const contractDeployed = new Web3.eth.Contract(abi, '0x582c5592e44775209ad4529479c0e0e66c576e2b');
        setContract(contractDeployed);


    }

    const buy = async () => {
        // @ts-ignore
        const Web3 = window.web3;
        const accounts = await Web3.eth.getAccounts()
        await contractDeployed.methods.buyTokens(address,quantity ).send({
            from: accounts[0],
            value: Web3.utils.toWei(value, "ether")
        })
        await getContractAddress()
    }

    const getUserBalance = async () => {
        // @ts-ignore
        const Web3 = window.web3;
        const accounts = await Web3.eth.getAccounts()
       const usrBalance= await contractDeployed.methods.balanceAccount(address).call()
        setUserBalance(usrBalance)


    }



    const getBalance = async () => {
        // @ts-ignore
        const Web3 = window.web3;
        const balance = await Web3.eth.getBalance(address)
        setBalance(balance)
    }

    const getContractAddress = async () => {
        const contractAddress = await contractDeployed.methods.getContractAddress().call();
        setContractAddress(contractAddress)

    }
    const increment = async () => {
        // @ts-ignore
        const Web3 = window.web3;
        const accounts = await Web3.eth.getAccounts()
        await contractDeployed.methods.generetaTokens(quantity).send({
            from: accounts[0]
        })
        await getTokens();

    }
    const getTokens = async () => {
        const tokenBalance = await contractDeployed.methods.getTotalSupply().call();
        setTokens(tokenBalance)

    }
    const getTokenPrice = async () => {
        // @ts-ignore
        const tokenprice = await contractDeployed.methods.priceTokens(quantity).call()
        setTokenPrice(tokenprice)

    }



    return (
        <div className="App">
            <button onClick={() => connectWallet()} className="btn btn-success">Connect</button>
            <div>
                <h1>Comprar tokens</h1>
                <label>
                    Dirección de destino
                    <input id='addressField' type="text" value={address} onChange={ (event) => { setAddress(event.target.value) } } />
                </label>
            </div>
            <div>
                <label>
                    Cantidad de tokens a comprar (1 token = 1 ether)
                    <input id='quantityField' type="number" value={quantity} onChange={ (event) => { setQuantity(event.target.value) } } />
                </label>
            </div>
            <div>
                <label>
                    Value input
                    <input id='quantityField' type="text" value={value} onChange={ (event) => { setValue(event.target.value) } } />
                </label>
            </div>
            <button onClick={() => buy()} className="btn btn-success">Comprar tokens</button>

            <div>
                <h1>Get User Balance</h1>
                <label>
                    Dirección del usuario
                    <input id='addressField' type="text" value={address} onChange={ (event) => { setAddress(event.target.value) } } />
                </label>
                <button onClick={() => getUserBalance()} className="btn btn-success">Get Balance</button>
                <p>User BALANCE: {userBalance}</p>
            </div>
            <button onClick={getBalance}>Contract Balance</button>
            <p>CONTRACT BALANCE: {balance}</p>
            <p>CONTRACT Address: {contractAddress}</p>

            <div>
                <h1>Añadir nuevos tokens</h1>
                <input id='addressField' type="number" value={quantity} onChange={ (event) => { setQuantity(event.target.value) } } />
                <button onClick={increment}>Add tokens</button>
            </div>
            <p>TOKEN BALANCE: {tokens}</p>
            <div>
                <h1>Token Price</h1>
                <input id='addressField' type="number" value={quantity} onChange={ (event) => { setQuantity(event.target.value) } } />
                <button onClick={getTokenPrice}>Get Price</button>
                <p>Token price: {tokenprice}</p>
            </div>
        </div>

    );
}

export default App;