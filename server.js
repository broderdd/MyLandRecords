const {createServer} = require('http');
const routes = require('./routes');
const next = require('next');


//so next we're going to use that next helper right here to create a new app instance
//  And we're going to pass a configuration object into this thing.
//This dev flag right here specifies whether we are running our server in a production or development mode.
const app = next ({
    dev: process.env.NODE_ENV !=='production'
});

const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
    createServer(handler).listen(3000, (err) => {
        if (err) throw err;
        console.log('Ready on localhost:3000');
    });
});
