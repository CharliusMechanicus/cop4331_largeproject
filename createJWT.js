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

// RETURNS AN ACCESS TOKEN STRING ON SUCCESS, 'false' OTHERWISE
_createToken = function (email_address_str)
{
  var ret;

  try
  {
    const user = {email_str : email_address_str};
    const access_token_str =  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    ret = access_token_str;
  }

  catch(e)
  {
    console.log(e.message);
    ret = false;
  }

  return ret;
};

/*************************************** NEXT FUNCTION *******************************************/

// DETERMINES WHETHER OR NOT GIVEN ACCESS TOKEN IS STILL VALID (EITHER FROM EXPIRING..
// ..OR DATA TAMPERING). RETURNS 'true' IF INVALID, 'false' OTHERWISE
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

// TAKES 'access_token_str' AND EXTRACTS USER SPECIFIC INFO TO CREATE A NEW JSON WEB TOKEN..
// .. WITH NEW EXPIRATION DATE
exports.refresh = function(access_token_str)
{
  var ud = jwt.decode(access_token_str, {complete:true});
  var email_address_str = ud.payload.email_str;
  var new_access_token_str = _createToken(email_address_str);
  
  return new_access_token_str;
};