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
    const access_token_str =  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    var ret = {access_token_str : access_token_str};
  }

  catch(e)
  {
    var ret = {error_message_str : e.message};
  }

  return ret;
};

/*************************************** NEXT FUNCTION *******************************************/

exports.isExpired = function(access_token_str)
{
  var isError = jwt.verify(access_token_str, process.env.ACCESS_TOKEN_SECRET,
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

exports.refresh = function(access_token_str)
{
  var ud = jwt.decode(access_token_str, {complete:true});
  var email_address_str = ud.payload.email_str;
  var access_token_obj = _createToken(email_address_str);
  
  return access_token_obj;
};