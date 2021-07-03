// THIS FILE IS FOR STORING AND RETRIEVING YOUR ACCESS TOKEN IN NON-VOLATILE MEMORY
// THIS TOKEN ORIGINALLY COMES FROM WHEN YOU SUCCESSFULLY LOGIN AND MUST BE PROVIDED TO PROVE U R U
// AFTER A SUCCESSFUL API CALL, A REFRESHED TOKEN IS PROVIDED (OTHERWISE, COULD EXPIRE)

exports.storeToken = function (tok)
{
    try
    {
      localStorage.setItem('token_data', tok.access_token);
    }
    
    catch(e)
    {
      console.log(e.message);
    }
}

/*****************************************************************************************************/

exports.retrieveToken = function ()
{
    var ud;
    
    try
    {
      ud = localStorage.getItem('token_data');
    }
    
    catch(e)
    {
      console.log(e.message);
    }
    
    return ud;
}