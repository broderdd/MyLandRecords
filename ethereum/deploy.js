// @ts-ignore
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledRegistry = require('./build/Registry.json');

const provider = new HDWalletProvider('robust rate fence inhale odor pass stuff gesture width cause club charge','https://kovan.infura.io/v3/525b3cf6c9624e9ea53030ef3242938e');
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledRegistry.interface)
  )
    .deploy({ data: '0x' + compiledRegistry.bytecode })
    .send({from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
};
deploy();
