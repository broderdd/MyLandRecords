//set up next js and set up routing

const routes = require('next-routes')();

//Add function is how we define route mapping. 
//First argument defined pattern to look for  (:blockAddress is wildcard)
//2nd argument - what component do we want to show from our pages directory
routes.add('/titles/new', '/titles/new')
    .add('/titles/pending','/titles/pending')
    .add('/titles','/titles/all')
    .add('/titles/:blockAddress', '/titles/detail')
    .add('/','index')




module.exports=routes;

