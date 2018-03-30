const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


mongoose.connection.openUri(process.env.CONNECTION_STRING,(error,response) =>{
    if (!response)
    {
        return console.log('Unable To Connect To MongoDB Local');
    }
    console.log('Connected To MongoDB local');
});