require('dotenv').config(); // GET ENVIRONMENTAL VARIABLES

/*********************
|  SCRIPT CONSTANTS  |
**********************/
const PORT = process.env.PORT || 5000;

/*************
|  REQUIRES  |
**************/
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const charlie_api = require('./charlie_api.js');
const peyton_api = require('./peyton_api.js');

/********************
|  SCRIPT EXECUTION |
*********************/

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));

/************************************************************************************************************************/

// IF APPLICATION IS DEPLOYED
if(process.env.NODE_ENV === 'production')
{
  // SET STATIC FOLDER
  app.use(express.static('frontend/build'));

  app.get('*', (req, res) => 
 {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

/************************************************************************************************************************/

// CONNECT TO DATABASE WITH CONNECTION STRING
const url = process.env.MONGODB_URI;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
client.connect();

/************************************************************************************************************************/

// CROSS ORIGIN RESOURCE SHARING CONCERNS
app.use((req, res, next) => 
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  
  next();
});

/************************************************************************************************************************/

// API ENDPOINTS FROM EXTERNAL FILES
charlie_api.setApp(app, client);
peyton_api.setApp(app, client);

/************************************************************************************************************************/

// LISTEN FOR SERVER REQUESTS IN EITHER DEPLOYMENT OR LOCAL ENVIRONMENTS
app.listen(PORT, () => 
{
  console.log('Server listening on port ' + PORT);
});