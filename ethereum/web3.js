import Web3 from 'web3';

//Adapted from Stephan Grinder, working with latest version of Metamask 
//  decided to remove their support for web3

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    // We are in the browser and metamask is running.
    web3 = new Web3(window.web3.currentProvider);
  } else {
    // We are on the server *OR* the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
      'https://kovan.infura.io/v3/525b3cf6c9624e9ea53030ef3242938e'
    );
    web3 = new Web3(provider);
  }
  
  export default web3;

/** 
//Check to see if we are on server or browser
if (typeof window !== 'undefined') {
    window.ethereum.enable();
    if(window.web3 !== 'undefined'){
        const provider = new Web3.providers.HttpProvider(
            'https://ropsten.infura.io/v3/d169b7c3d83a44b182c2d139c074ded7'
            );
        web3 = new Web3(provider);
        console.log(web3.eth.getAccounts()[0])

    } else{
        web3 = new Web3(window.web3.currentProvider);
    }
}else{
    // We are on the server *OR* the user is not running metamask
    //Have to create our own provider
    const provider = new Web3.providers.HttpProvider(
        'https://ropsten.infura.io/v3/d169b7c3d83a44b182c2d139c074ded7'
    );
    web3 = new Web3(provider);
}

export default web3;

/**
So let's now save this file and the next thing we need to do is to tell web 3 that we have already deployed
a copy of the Registry contract. So for this we're going to create another separate file and inside 
there we will import web 3.

We will then tell web3 about that contract and we will provide the address to it. In the same exact way
that we now have a file that we can easily import to get access to Web 3, The idea here is that by 
making a separate file that is going to house our factory contract we can import that contractor that 
file into any other location side of our project and instantly have access to it already deployed version of the factory.
 */
