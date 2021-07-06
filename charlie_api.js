/****************************
| COMPOSED BY: CHARLIE TAN  |
*****************************/

exports.setApp = function(app, client)
{

  // REGISTER API ENDPOINT
  // INPUT: JSON OBJECT (email_str, password_str, display_name_str, phone_str, is_group_bool)
  // OUTPUT: JSON OBJECT (success_bool, email_str, is_group_bool)
  app.post('/api/register', async (req, res, next) =>
  {
  
    /********************
    |  LOCAL VARIABLES  |
    *********************/
    let request_body_data;
    let user_email_str;
    let user_password_str;
    let user_display_name_str;
    let user_phone_str;
    let user_isgroup_bool;
    
    let database;
    let database_results_array;

    let registration_success_bool;
    let json_response_obj;

    /*********************************************************************************************/
    
    // EXTRACT INFORMATION
    request_body_data = req.body;
    user_email_str = request_body_data.email_str;
    user_password_str = request_body_data.password_str;
    user_display_name_str = request_body_data.display_name_str;
    user_phone_str = request_body_data.phone_str;
    user_isgroup_bool = request_body_data.is_group_bool;
    
    /*********************************************************************************************/
    
    // CHECK DATABASE TO SEE IF CLIENT IS ALREADY REGISTERED

    try
    {
      database = client.db();

      // FIRST, CHECK TO SEE IF CLIENT ALREADY REGISTERED AS AN INDIVIDUAL
      database_results_array =
        await database.collection("individuals").find( {email : user_email_str} ).toArray();

      // IF NOT AN INDIVIDUAL, CONTINUE SEARCHING TO SEE IF REGISTERED AS A GROUP
      if(database_results_array.length === 0)
      {
        database_results_array =
          await database.collection("groups").find( {email : user_email_str} ).toArray();
      }
    }

    catch(error)
    {
      console.log(error.message);
    }

    /*********************************************************************************************/

    // IF THERE IS CURRENTLY NO ONE IN THE DATABASE REGISTERED WITH THE PROVIDED EMAIL
    if(database_results_array.length === 0)
    {
      try
      {
        if(!user_isgroup_bool)
        {
          // SIGN THEM UP AS AN INDIVIDUAL
          database.collection("individuals").insertOne(
            individual_obj_factory
            (user_email_str, user_password_str, user_display_name_str, user_phone_str, {}, "", {}, 0, new Array) );
        }
      
        else
        {
          // SIGN THEM UP AS A GROUP
          database.collection("groups").insertOne(
            group_obj_factory
            (user_email_str, user_password_str, user_display_name_str, user_phone_str, {}, "", {}, 0, new Array) );
        }
      
        registration_success_bool = true;
      }
      
      catch(error)
      {
        console.log(error.message);
      }
    }
    
    // OTHERWISE, SOMEONE IS ALREADY REGISTERED WITH THAT EMAIL
    else
    {
      registration_success_bool = false;
    }

    /*********************************************************************************************/

    json_response_obj = {success_bool : registration_success_bool, email_str : user_email_str,
      is_group_bool : user_isgroup_bool};
      
    res.status(200).json(json_response_obj);
    
  }); // END REGISTER API ENDPOINT

  /********************************** NEXT API ENDPOINT ******************************************/

  // LOGIN API ENDPOINT
  // INPUT: JSON OBJECT (email_str, password_str)
  // OUTPUT: JSON OBJECT (success_bool, email_str, is_group_bool, access_token_str)
  app.post('/api/login', async (req, res, next) =>
  {

    /********************
    |  LOCAL VARIABLES  |
    *********************/
    let request_body_data;
    let user_email_str;
    let user_password_str;
    let user_isgroup_bool;
    let collection_str;
    
    let database;
    let database_results_array;
    let access_token_str;

    let login_success_bool;
    let json_response_obj;
    
    let my_token_functions = require("./createJWT.js");

    /*********************************************************************************************/

    // EXTRACT INFORMATION
    request_body_data = req.body;
    user_email_str = request_body_data.email_str;
    user_password_str = request_body_data.password_str;

    /*********************************************************************************************/

    // CONNECT TO DATABASE
    try
    {
      database = client.db();
    }
    catch(error)
    {
      console.log(error.message);
    }

    collection_str = await user_exists_in_this_collection(user_email_str, database);

    /*********************************************************************************************/

    // IF USER COULD NOT BE FOUND IN DATABASE
    if(!collection_str)
    {
      login_success_bool = false;
      user_isgroup_bool = "";
      access_token_str = "";
    }
    
    // OTHERWISE, USER WAS FOUND IN DATABASE
    else
    {    
      // CONTINUE WITH PASSWORD AND STATUS CODE VERIFICATION
      try
      {
        database_results_array =
          await database.collection(collection_str).find(
          {email : user_email_str, password : user_password_str, ready_status : {$gt : 0}} ).toArray();
        
        // IF PASSWORD AND STATUS CODE ARE OK
        if(database_results_array.length > 0)
        {
          login_success_bool = true;
          user_isgroup_bool = is_this_collection_a_group(collection_str);
          access_token_str = my_token_functions.createToken(user_email_str);
        }
        
        // OTHERWISE, PASSWORD OR STATUS CODE WERE NO GOOD
        else
        {
          login_success_bool = false;
          user_isgroup_bool = "";
          access_token_str = "";
        }
      }
      
      catch(error)
      {
        console.log(error);
      }
    }
    
    /*********************************************************************************************/
    
    json_response_obj = {success_bool : login_success_bool, email_str : user_email_str,
      is_group_bool : user_isgroup_bool, access_token_str : access_token_str};
    
    res.status(200).json(json_response_obj);
    
  }); // END LOGIN API ENDPOINT

  /*********************************** END API ENDPOINTS *****************************************/

  /***************************
  |  USER-DEFINED FUNCTIONS  |
  ****************************/

  function individual_obj_factory(email_str, pwd_str, display_name_str, phone_str,
    ind_categories_obj, description_str, candidate_group_categories_obj, ready_status_int,
    candidates_array)
  {
    let individual_obj =
    {
      email : email_str,
      password : pwd_str,
      display_name : display_name_str,
      phone : phone_str,
      individual_categories : ind_categories_obj,
      description : description_str,
      candidate_group_categories : candidate_group_categories_obj,
      ready_status : ready_status_int,
      candidates : candidates_array
    }
    
    return individual_obj;
  }

  /************************************* NEXT FUNCTION *******************************************/

  function group_obj_factory(email_str, pwd_str, display_name_str, phone_str,
    group_categories_obj, description_str, candidate_ind_categories_obj, ready_status_int,
    candidates_array)
  {
    let group_obj =
    {
      email : email_str,
      password : pwd_str,
      display_name : display_name_str,
      phone : phone_str,
      group_categories : group_categories_obj,
      description : description_str,
      candidate_individual_categories : candidate_ind_categories_obj,
      ready_status : ready_status_int,
      candidates : candidates_array
    }
    
    return group_obj;
  }

  /************************************* NEXT FUNCTION *******************************************/

  // 'database' IS ASSUMED TO BE A VALID CONNECTION
  // RETURNS STRING "individuals" OR "groups" FOR THE COLLECTION 'user_email_str' IS FOUND IN
  // RETURNS EMPTY STRING ("") IF USER COULD NOT BE FOUND IN ANY COLLECTION
  // RETURNS 'undefined' IF ERROR OCCURS WHILE PERFORMING DATABASE OPERATIONS
  async function user_exists_in_this_collection(user_email_str, database)
  {
    let database_results_array;
    let collection_str;

    try
    {
      database_results_array =
        await database.collection("individuals").find( {email : user_email_str} ).toArray();

      // IF USER IS NOT FOUND IN THE 'individuals' COLLECTION
      if(database_results_array.length === 0)
      {
        // KEEP SEARCHING FOR USER IN 'groups' COLLECTION
        database_results_array =
          await database.collection("groups").find( {email : user_email_str} ).toArray();
      
        // IF USER IS NOT FOUND IN 'groups' COLLECTION
        if(database_results_array.length === 0)
        {
          collection_str = "";
        }
      
        // OTHERWISE, USER IS FOUND IN THE 'groups' COLLECTION
        else
        {
          collection_str = "groups";
        }
      }
    
      // OTHERWISE, USER IS FOUND IN THE 'individuals' COLLECTION
      else
      {
        collection_str = "individuals";
      }
    } // END TRY
    
    catch(error)
    {
      console.log(error);
    }
    
    return collection_str;
  }

  /************************************* NEXT FUNCTION *******************************************/

  // RETURNS 'true' IF 'collection_str' REPRESENTS THE 'groups' COLLECTION, 'false' OTHERWISE.
  // NOTE THAT A 'false' RETURN DOES NOT AUTOMATICALLY MEAN THAT 'collection_str' REPRESENTS THE..
  // ..'individuals' COLLECTION
  function is_this_collection_a_group(collection_str)
  {
    if(collection_str === "groups")
      return true;

    else
      return false;
  }

}; // END setApp