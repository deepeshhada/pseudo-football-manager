const mongoose = require('mongoose');
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if (err) {
        console.log('Could NOT connect to the database:', err);
    } else {
        console.log('Connected to database:', config.db);
    }
}); 

var corsOptions = {
  origin: 'http://example.com',
  optionsSuccessStatus: 200 
}
app.use(cors({
    origin: 'http://localhost:4200'
}));

app.use(bodyParser.urlencoded( { extended: false } ));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/client/dist'));
app.use('/authentication', authentication);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});

