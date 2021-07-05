// THIS FILE IS FOR STORING AND RETRIEVING YOUR ACCESS TOKEN IN NON-VOLATILE MEMORY
// THIS TOKEN ORIGINALLY COMES FROM WHEN YOU SUCCESSFULLY LOGIN AND MUST BE PROVIDED TO PROVE U R U
// AFTER A SUCCESSFUL API CALL, A REFRESHED TOKEN IS PROVIDED (OTHERWISE, COULD EXPIRE)

exports.storeToken = function (access_token_str)
{
    try
    {
      localStorage.setItem('token_data', access_token_str);
    }

    catch(e)
    {
      console.log(e.message);
    }
}

/*****************************************************************************************************/

exports.retrieveToken = function ()
{
    var access_token_str;
    
    try
    {
      access_token_str = localStorage.getItem('token_data');
    }
    
    catch(e)
    {
      console.log(e.message);
    }
    
    return access_token_str;
}