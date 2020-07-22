import web3 from './web3';


/**
So remember any time that we want to tell web 3 about a already deployed 
contract we have to give web3 that contracts interface or ABI.
And the ABI is defined inside of the  Registry JSON file.
 */

import Registry from './build/Registry.json';

const registryInstance = new web3.eth.Contract(
    JSON.parse(Registry.interface),
    '0x761756d4279A6E5a9f380576356915D06E72654a'
);

export default registryInstance;

/**
The entire idea here is that if we need
to get access to our deployed factory instance from somewhere else inside
of our application we won't have to go through this entire process of 
importing web 3. We are telling web3 that a deployed copy of Registry exists!! 
 */
