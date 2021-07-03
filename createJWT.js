/************
|  REQUIRES  |
*************/

const jwt = require("jsonwebtoken");
require("dotenv").config(); // ALLOW ACCESS TO ENVIRONMENTAL VARIABLES

/************************
|  FUNCTION EXPRESSIONS  |
*************************/

exports.createToken = function (email_address_str)
{
  return _createToken(email_address_str);
};

/*************************************** NEXT FUNCTION *******************************************/

_createToken = function (email_address_str)
{
  try
  {
    const user = {email_str : email_address_str};
    const access_token =  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    var ret = {access_token : access_token};
  }

  catch(e)
  {
    var ret = {error_message_str : e.message};
  }

  return ret;
};

/*************************************** NEXT FUNCTION *******************************************/

exports.isExpired = function(token)
{
  var isError = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,
                           (err, verifiedJwt) =>
     {
       if(err)
       {
         return true;
       }

       else
       {
         return false;
       }
     });

  return isError;
};

/*************************************** NEXT FUNCTION *******************************************/

exports.refresh = function(token)
{
  var ud = jwt.decode(token, {complete:true});
  var email_address_str = ud.payload.email_str;

  return _createToken(email_address_str);
};