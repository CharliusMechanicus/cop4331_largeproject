const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const get_profile_individual = express.Router();
const PORT = 4000;

let Group = require(./models/Group.mode.js);

app.use(cors());
app.use(bodyParser.json());
app.use('/get_profile_group', get_profile_individual);

mongoose.connect('mongodb://127.0.0.1:27017/', { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});

get_profile_group.route('/').get(function(req, res) {
  Group.find(function(err, groups) {
      if (err) {
          console.log(err);
      } else {
          res.json(groups);
      }
  });
});
