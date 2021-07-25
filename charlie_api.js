/****************************
| COMPOSED BY: CHARLIE TAN  |
*****************************/

/**************************************
|      TABLE OF CONTENTS (API's)      |
---------------------------------------
|  (in order of appearance)           |
|                                     |
|  register                           |
|  login                              |
|  send_verification_email            |
|  verify_email                       |
|  bypass_email_verification          |
|  get_ready_status                   |
|  initialize_profile_individual      |
|  initialize_profile_group           |
|  update_profile                     |
|  get_matches                        |
|  swipe_left                         |
|  send_password_reset                |
|  reset_password                     |
|  shove_user_into_database           |
***************************************/

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
  // OUTPUT: JSON OBJECT (success_bool, email_str, is_group_bool, ready_status_int, access_token_str)
  app.post('/api/login', async (req, res, next) =>
  {

    /********************
    |  LOCAL VARIABLES  |
    *********************/
    let request_body_data;
    let user_email_str;
    let user_password_str;
    let collection_str;
    
    let database;
    let database_results_array;
    let access_token_str;

    // TO RETURN
    let login_success_bool;
    let user_isgroup_bool;
    let ready_status_int;
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
      ready_status_int = -1234;
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
          ready_status_int = database_results_array[0].ready_status;
          access_token_str = my_token_functions.createToken(user_email_str);
        }
        
        // OTHERWISE, PASSWORD OR STATUS CODE WERE NO GOOD
        else
        {
          login_success_bool = false;
          user_isgroup_bool = "";
          
          if( await this_user_has_this_password(user_email_str, user_password_str, database, collection_str) )
            ready_status_int = await extract_ready_status_from_user(user_email_str, database);
          else
            ready_status_int = -1234;
            
          access_token_str = "";
        }
      }
      
      catch(error)
      {
        console.log(error.message);
        
        login_success_bool = false;
        user_isgroup_bool = "";
        ready_status_int = -1234;
        access_token_str = "";
      }
    }
    
    /*********************************************************************************************/
    
    json_response_obj = {success_bool : login_success_bool, email_str : user_email_str,
      is_group_bool : user_isgroup_bool, ready_status_int : ready_status_int, access_token_str : access_token_str};
    
    res.status(200).json(json_response_obj);
    
  }); // END LOGIN API ENDPOINT

  /********************************** NEXT API ENDPOINT ******************************************/

  // SEND_VERIFICATION_EMAIL API ENDPOINT
  // INPUT: JSON OBJECT (email_str)
  // OUTPUT: JSON OBJECT (success_bool)
  app.post('/api/send_verification_email', async (req, res, next) =>
  {

    /********************
    |  LOCAL VARIABLES  |
    *********************/
    let request_body_data;
    let user_email_str;

    // TO RETURN
    let send_success_bool;
    let json_response_obj;

    let database;
    let database_results_array;
    let collection_str;
    
    const EMAIL_SUBJECT_STR = "Verification Code From Kindling";
    const CODE_LENGTH_INT = 10;
    let msg_body_str;
    let verification_code_str;

    /*********************************************************************************************/

    // EXTRACT INFORMATION
    request_body_data = req.body;
    user_email_str = request_body_data.email_str;

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
      send_success_bool = false;
    }    

    // OTHERWISE, USER WAS FOUND IN DATABASE
    else
    {
      database_results_array =
        await database.collection(collection_str).find( {email : user_email_str, ready_status : 0} ).toArray();
      
      // IF THE USER DOES NOT HAVE A 'ready_status' CODE OF ZERO
      if(database_results_array.length === 0)
        send_success_bool = false;
      
      // OTHERWISE, THE USER CAN BE SENT VERIFICATION EMAILS
      else
      {
        verification_code_str = create_code(CODE_LENGTH_INT);
       
        while( await does_this_code_exist(verification_code_str, database) )
        {
          verification_code_str = create_code(CODE_LENGTH_INT);
        }
        // AT THIS POINT, WE SHOULD HAVE A UNIQUE CODE
        
        msg_body_str = ("Your verification code is: " + verification_code_str);
        
        await send_email(user_email_str, EMAIL_SUBJECT_STR, msg_body_str).then(
          function (resolved_value)
          {
            send_success_bool = resolved_value;
          },
          
          function(rejected_value)
          {
            send_success_bool = rejected_value;
          });
        
        // IF VERIFICATION EMAIL WAS SUCCESSFULLY SENT
        if(send_success_bool)
          save_verification_code(verification_code_str, user_email_str, database);
      }
    }

    /*********************************************************************************************/

    json_response_obj = {success_bool : send_success_bool};

    res.status(200).json(json_response_obj);

  }); // END SEND_VERIFICATION_EMAIL API ENDPOINT

  /********************************** NEXT API ENDPOINT ******************************************/

  // VERIFY_EMAIL API ENDPOINT
  // INPUT: JSON OBJECT (code_str)
  // OUTPUT: JSON OBJECT (success_bool)
  app.post('/api/verify_email', async (req, res, next) =>
  {
  
    /********************
    |  LOCAL VARIABLES  |
    *********************/
    let request_body_data;
    let verification_code_str;
    let user_email_str;

    // TO RETURN
    let verification_success_bool;
    let json_response_obj;

    let database;
    let database_results_array;
    let collection_str;
    const COLLECTION_4_CODE_STORAGE = "codes";
    
    /*********************************************************************************************/

    // EXTRACT INFORMATION
    request_body_data = req.body;
    verification_code_str = request_body_data.code_str;

    /*********************************************************************************************/

    // FIRST CHECK - MAKE SURE EMPTY STRING CANNOT BE ACCEPTED
    if(verification_code_str === "")
    {
      json_response_obj = {success_bool : false};
      res.status(200).json(json_response_obj);
      return;
    }

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

    /*********************************************************************************************/

    database_results_array = await
      database.collection(COLLECTION_4_CODE_STORAGE).
      find( {verification_code : verification_code_str} ).toArray();

    // IF THE CODE IS NOT CURRENTLY CONNECTED TO ANY USER
    if(database_results_array.length === 0)
      verification_success_bool = false;

    // OTHERWISE, THE CODE IS CONNECTED TO A USER
    else
    {
      // FIND USER CONNECTED TO THE CODE
      user_email_str = database_results_array[0].email;
      collection_str = await user_exists_in_this_collection(user_email_str, database);

      // IF USER COULD NOT BE FOUND IN DATABASE
      if(!collection_str)
      {
        verification_success_bool = false;
      }

      // OTHERWISE, USER WAS FOUND IN DATABASE
      else
      {
        try
        {
          // IF USER HAS A READY STATUS OF ZERO, CHANGE READY STATUS TO 1
          database.collection(collection_str).updateOne( {email : user_email_str, ready_status : 0},
            { $set : {ready_status : 1} } );

          // NORMAL SCENARIO IS THAT READY STATUS CODE CHANGES FROM ZERO TO 1, HOWEVER, IN THE..
          // ..EDGE CASE THAT THE USER HAS A READY STATUS CODE ALREADY GREATER THAN ZERO, THE..
          // ..READY STATUS CODE WILL BE LEFT AT ITS CURRENT VALUE AND CONSIDERED VERIFIED (IN PAST)
          verification_success_bool = true;
        }
        
        catch(error)
        {
          console.log(error.message);
          verification_success_bool = false;
        }
      }
    }

    /*********************************************************************************************/

    json_response_obj = {success_bool : verification_success_bool};

    res.status(200).json(json_response_obj);

  }); // END VERIFY_EMAIL API ENDPOINT

  /********************************** NEXT API ENDPOINT ******************************************/

  // BYPASS_EMAIL_VERIFICATION API ENDPOINT (FOR DEVELOPMENT PURPOSES ONLY)
  // INPUT: JSON OBJECT (email_str)
  // OUTPUT: JSON OBJECT (success_bool)
  app.post('/secret_api/bypass_email_verification', async (req, res, next) =>
  {
  
    /********************
    |  LOCAL VARIABLES  |
    *********************/
    let request_body_data;
    let user_email_str;
    
    let verification_success_bool;
    let json_response_obj;

    let database;
    let collection_str;
    
    /*********************************************************************************************/

    // EXTRACT INFORMATION
    request_body_data = req.body;
    user_email_str = request_body_data.email_str;

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
      verification_success_bool = false;
    }    

    // OTHERWISE, USER WAS FOUND IN DATABASE
    else
    {
      try
      {
        // IF USER HAS A READY STATUS CODE OF ZERO, CHANGE IT TO 1
        database.collection(collection_str).updateOne( {email : user_email_str, ready_status : 0},
          { $set : {ready_status : 1} } );

        // NORMAL SCENARIO IS THAT READY STATUS CODE CHANGES FROM ZERO TO 1, HOWEVER, IN THE..
        // ..EDGE CASE THAT THE USER HAS A READY STATUS CODE ALREADY GREATER THAN ZERO, THE..
        // ..READY STATUS CODE WILL BE LEFT AT ITS CURRENT VALUE AND CONSIDERED VERIFIED (IN PAST)
        verification_success_bool = true;
      }
      
      catch(error)
      {
        console.log(error.message);
        verification_success_bool = false;
      }
    }

    /*********************************************************************************************/

    json_response_obj = {success_bool : verification_success_bool};

    res.status(200).json(json_response_obj);

  }); // END BYPASS_EMAIL_VERIFICATION API ENDPOINT

  /********************************** NEXT API ENDPOINT ******************************************/

  // GET_READY_STATUS API ENDPOINT
  // INPUT: JSON OBJECT (email_str, access_token_str)
  // OUTPUT: JSON OBJECT (success_bool, ready_status_int, refreshed_token_str)
  app.post('/api/get_ready_status', async (req, res, next) =>
  {

    /********************
    |  LOCAL VARIABLES  |
    *********************/
    let request_body_data;
    let user_email_str;
    let user_access_token_str;

    // TO RETURN
    let get_status_success_bool;
    let user_ready_status_int;
    let refreshed_token_str;
    let json_response_obj;

    let database;
    let database_results_array;
    let collection_str;
    
    /********************
    |  LOCAL FUNCTIONS  |
    *********************/
    
    const json_response_obj_factory =
      function (success_bool, ready_status_int, refreshed_token_str)
      {
        let json_response_obj =
          {
            success_bool : success_bool,
            ready_status_int : ready_status_int,
            refreshed_token_str : refreshed_token_str
          };
          
        return json_response_obj;
      };
    
    /*********************************************************************************************/

    // EXTRACT INFORMATION
    request_body_data = req.body;
    user_email_str = request_body_data.email_str;
    user_access_token_str = request_body_data.access_token_str;

    /*********************************************************************************************/

    // IF TOKEN IS NOT VALID
    if(!is_token_valid(user_access_token_str, user_email_str, "d"))
    {
      get_status_success_bool = false;
      user_ready_status_int = -1234;
      refreshed_token_str = "";
      
      json_response_obj =
        json_response_obj_factory(get_status_success_bool, user_ready_status_int,
        refreshed_token_str);

      res.status(200).json(json_response_obj);
      return;
    }

    /*********************************************************************************************/
    // AT THIS POINT, WE CAN ASSUME CLIENT'S ACCESS TOKEN IS VALID

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
      get_status_success_bool = false;
      user_ready_status_int = -1234;
      refreshed_token_str = create_refreshed_token(user_access_token_str);
      
      json_response_obj =
        json_response_obj_factory(get_status_success_bool, user_ready_status_int,
        refreshed_token_str);
        
      res.status(200).json(json_response_obj);
      return;
    }

    // OTHERWISE, USER WAS FOUND IN DATABASE
    else
    {
      try
      {
        database_results_array =
          await database.collection(collection_str).find( {email : user_email_str} ).toArray();
        
        get_status_success_bool = true;
        user_ready_status_int = database_results_array[0].ready_status;
        refreshed_token_str = create_refreshed_token(user_access_token_str);
        
        json_response_obj =
          json_response_obj_factory(get_status_success_bool, user_ready_status_int,
          refreshed_token_str);
      }
      
      catch(error)
      {
        console.log(error.message);
        
        get_status_success_bool = false;
        user_ready_status_int = -1234;
        refreshed_token_str = create_refreshed_token(user_access_token_str);
        
        json_response_obj =
          json_response_obj_factory(get_status_success_bool, user_ready_status_int,
          refreshed_token_str);
      }
    }

    /*********************************************************************************************/

    res.status(200).json(json_response_obj);

  }); // END GET_READY_STATUS API ENDPOINT

  /********************************** NEXT API ENDPOINT ******************************************/

  // INITIALIZE_PROFILE_INDIVIDUAL API ENDPOINT
  // INPUT: JSON OBJECT (email_str, individual_categories_obj, description_str,
  //   candidate_group_categories_obj, access_token_str)
  // OUTPUT: JSON OBJECT (success_bool, refreshed_token_str)
  app.post('/api/initialize_profile_individual', async (req, res, next) =>
  {
  
    /********************
    |  LOCAL VARIABLES  |
    *********************/
    let request_body_data;
    let user_email_str;
    let individual_categories_obj;
    let user_description_str;
    let candidate_group_categories_obj;
    let user_access_token_str;

    // TO RETURN
    let success_bool;
    let refreshed_token_str;
    let json_response_obj;

    let database;
    let update_report_doc;
    let collection_str;  

    /********************
    |  LOCAL FUNCTIONS  |
    *********************/
    
    const json_response_obj_factory =
      function (success_bool, refreshed_token_str)
      {
        let json_response_obj =
          {
            success_bool : success_bool,
            refreshed_token_str : refreshed_token_str
          };
          
        return json_response_obj;
      };

    /*********************************************************************************************/

    // EXTRACT INFORMATION
    request_body_data = req.body;
    user_email_str = request_body_data.email_str;
    individual_categories_obj = request_body_data.individual_categories_obj;
    user_description_str = request_body_data.description_str;
    candidate_group_categories_obj = request_body_data.candidate_group_categories_obj;
    user_access_token_str = request_body_data.access_token_str;

    /*********************************************************************************************/

    // IF TOKEN IS NOT VALID
    if(!is_token_valid(user_access_token_str, user_email_str))
    {
      success_bool = false;
      refreshed_token_str = "";
      
      json_response_obj =
        json_response_obj_factory(success_bool, refreshed_token_str);

      res.status(200).json(json_response_obj);
      return;
    }

    /*********************************************************************************************/
    // AT THIS POINT, WE CAN ASSUME CLIENT'S ACCESS TOKEN IS VALID

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
      success_bool = false;
      refreshed_token_str = create_refreshed_token(user_access_token_str);
      
      json_response_obj =
        json_response_obj_factory(success_bool, refreshed_token_str);
        
      res.status(200).json(json_response_obj);
      return;
    }

    // OTHERWISE, USER WAS FOUND IN DATABASE
    else
    {
      // IF USER IS ACTUALLY A GROUP LOOKING FOR INDIVIDUALS
      if(is_this_collection_a_group(collection_str))
      {
        success_bool = false;
        refreshed_token_str = create_refreshed_token(user_access_token_str);
        
        json_response_obj =
          json_response_obj_factory(success_bool, refreshed_token_str);
        
        res.status(200).json(json_response_obj);
        return;
      }

      /***************************************************************************/

      // AT THIS POINT, WE CAN ASSUME THE USER IS AN INDIVIDUAL
      try
      {
        // UPDATE USER'S INFORMATION ONLY IF THEIR 'ready_status' IS 1
        update_report_doc = await
          database.collection(collection_str).updateOne( {email : user_email_str, ready_status : 1},
          { $set : {individual_categories : individual_categories_obj,
                    description : user_description_str,
                    candidate_group_categories : candidate_group_categories_obj,
                    ready_status : 2} } );

        // IF USER'S 'ready_status' WAS A 1 AND PROFILE INFO WAS UPDATED
        if(update_report_doc.modifiedCount === 1)
        {
          success_bool = true;
          refreshed_token_str = create_refreshed_token(user_access_token_str);
        }
        
        // OTHERWISE, USER'S 'ready_status' WAS SOME VALUE OTHER THAN A 1
        else
        {
          success_bool = false;
          refreshed_token_str = create_refreshed_token(user_access_token_str);
        }
      }
      
      catch(error)
      {
        console.log(error.message);
        
        success_bool = false;
        refreshed_token_str = create_refreshed_token(user_access_token_str);
      }
    }

    /*********************************************************************************************/

    json_response_obj = json_response_obj_factory(success_bool, refreshed_token_str);
    res.status(200).json(json_response_obj);

  }); // END INITIALIZE_PROFILE_INDIVIDUAL API ENDPOINT

  /********************************** NEXT API ENDPOINT ******************************************/
  
  // INITIALIZE_PROFILE_GROUP API ENDPOINT
  // INPUT: JSON OBJECT (email_str, group_categories_obj, description_str,
  //   candidate_individual_categories_obj, access_token_str)
  // OUTPUT: JSON OBJECT (success_bool, refreshed_token_str)
  app.post('/api/initialize_profile_group', async (req, res, next) =>
  {
  
    /********************
    |  LOCAL VARIABLES  |
    *********************/
    let request_body_data;
    let user_email_str;
    let group_categories_obj;
    let user_description_str;
    let candidate_individual_categories_obj;
    let user_access_token_str;

    // TO RETURN
    let success_bool;
    let refreshed_token_str;
    let json_response_obj;

    let database;
    let update_report_doc;
    let collection_str;  

    /********************
    |  LOCAL FUNCTIONS  |
    *********************/
    
    const json_response_obj_factory =
      function (success_bool, refreshed_token_str)
      {
        let json_response_obj =
          {
            success_bool : success_bool,
            refreshed_token_str : refreshed_token_str
          };
          
        return json_response_obj;
      };

    /*********************************************************************************************/

    // EXTRACT INFORMATION
    request_body_data = req.body;
    user_email_str = request_body_data.email_str;
    group_categories_obj = request_body_data.group_categories_obj;
    user_description_str = request_body_data.description_str;
    candidate_individual_categories_obj = request_body_data.candidate_individual_categories_obj;
    user_access_token_str = request_body_data.access_token_str;

    /*********************************************************************************************/

    // IF TOKEN IS NOT VALID
    if(!is_token_valid(user_access_token_str, user_email_str))
    {
      success_bool = false;
      refreshed_token_str = "";
      
      json_response_obj =
        json_response_obj_factory(success_bool, refreshed_token_str);

      res.status(200).json(json_response_obj);
      return;
    }

    /*********************************************************************************************/
    // AT THIS POINT, WE CAN ASSUME CLIENT'S ACCESS TOKEN IS VALID

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
      success_bool = false;
      refreshed_token_str = create_refreshed_token(user_access_token_str);
      
      json_response_obj =
        json_response_obj_factory(success_bool, refreshed_token_str);
        
      res.status(200).json(json_response_obj);
      return;
    }

    // OTHERWISE, USER WAS FOUND IN DATABASE
    else
    {
      // IF USER IS ACTUALLY AN INDIVIDUAL LOOKING FOR GROUPS
      if(!is_this_collection_a_group(collection_str))
      {
        success_bool = false;
        refreshed_token_str = create_refreshed_token(user_access_token_str);
        
        json_response_obj =
          json_response_obj_factory(success_bool, refreshed_token_str);
        
        res.status(200).json(json_response_obj);
        return;
      }

      /***************************************************************************/

      // AT THIS POINT, WE CAN ASSUME THE USER IS A GROUP
      try
      {
        // UPDATE USER'S INFORMATION ONLY IF THEIR 'ready_status' IS 1
        update_report_doc = await
          database.collection(collection_str).updateOne( {email : user_email_str, ready_status : 1},
          { $set : {group_categories : group_categories_obj,
                    description : user_description_str,
                    candidate_individual_categories : candidate_individual_categories_obj,
                    ready_status : 2} } );

        // IF USER'S 'ready_status' WAS A 1 AND PROFILE INFO WAS UPDATED
        if(update_report_doc.modifiedCount === 1)
        {
          success_bool = true;
          refreshed_token_str = create_refreshed_token(user_access_token_str);
        }
        
        // OTHERWISE, USER'S 'ready_status' WAS SOME VALUE OTHER THAN A 1
        else
        {
          success_bool = false;
          refreshed_token_str = create_refreshed_token(user_access_token_str);
        }
      }
      
      catch(error)
      {
        console.log(error.message);
        
        success_bool = false;
        refreshed_token_str = create_refreshed_token(user_access_token_str);
      }
    }

    /*********************************************************************************************/

    json_response_obj = json_response_obj_factory(success_bool, refreshed_token_str);
    res.status(200).json(json_response_obj);

  }); // END INITIALIZE_PROFILE_GROUP API ENDPOINT

  /********************************** NEXT API ENDPOINT ******************************************/

  // UPDATE_PROFILE API ENDPOINT
  // INPUT: JSON OBJECT (email_str, update_fields_obj, access_token_str)
  // OUTPUT: JSON OBJECT (success_bool, refreshed_token_str)

  app.post('/api/update_profile', async (req, res, next) =>
  {
  
    /********************
    |  LOCAL VARIABLES  |
    *********************/
    let request_body_data;
    let user_email_str;
    let update_fields_obj;
    let user_access_token_str;

    let display_name_str;
    let phone_str;
    let description_str;

    // TO RETURN
    let update_success_bool;
    let refreshed_token_str;
    let json_response_obj;
    
    let database;
    let database_results_array;
    let collection_str;

    /********************
    |  LOCAL FUNCTIONS  |
    *********************/
    
    const json_response_obj_factory =
      function (success_bool, refreshed_token_str)
      {
        let json_response_obj =
          {
            success_bool : success_bool,
            refreshed_token_str : refreshed_token_str
          };
          
        return json_response_obj;
      };

    /*********************************************************************************************/

    // EXTRACT INFORMATION
    request_body_data = req.body;
    user_email_str = request_body_data.email_str;
    update_fields_obj = request_body_data.update_fields_obj;
    user_access_token_str = request_body_data.access_token_str;

    display_name_str = update_fields_obj.display_name_str;
    phone_str = update_fields_obj.phone_str;
    description_str = update_fields_obj.description_str;

    /*********************************************************************************************/

    // IF TOKEN IS NOT VALID
    if(!is_token_valid(user_access_token_str, user_email_str))
    {
      update_success_bool = false;
      refreshed_token_str = "";
      
      json_response_obj =
        json_response_obj_factory(update_success_bool, refreshed_token_str);

      res.status(200).json(json_response_obj);
      return;
    }

    /*********************************************************************************************/
    // AT THIS POINT, WE CAN ASSUME THE ACCESS TOKEN IS VALID

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
      update_success_bool = false;
      refreshed_token_str = create_refreshed_token(user_access_token_str);
      json_response_obj = json_response_obj_factory(update_success_bool, refreshed_token_str);
      res.status(200).json(json_response_obj);
      return;
    }    

    /*********************************************************************************************/
    // AT THIS POINT, WE CAN ASSUME THE USER IS FOUND IN THE DATABASE

    // IF USER WISHES TO UPDATE THEIR DISPLAY NAME
    if(display_name_str !== undefined)
    {
      database.collection(collection_str).updateOne( {email : user_email_str},
        { $set : {display_name : display_name_str} } );
        
      update_success_bool = true;
    }
    
    // IF USER WISHES TO UPDATE THEIR PHONE NUMBER
    if(phone_str !== undefined)
    {
      database.collection(collection_str).updateOne( {email : user_email_str},
        { $set : {phone : phone_str} } );
        
      update_success_bool = true;
    }
    
    // IF USER WISHES TO UPDATE THEIR DESCRIPTION
    if(description_str !== undefined)
    {
      database.collection(collection_str).updateOne( {email : user_email_str},
        { $set : {description : description_str} } );
        
      update_success_bool = true;
    }

    /*********************************************************************************************/

    if(update_success_bool !== true)
      update_success_bool = false;

    refreshed_token_str = create_refreshed_token(user_access_token_str);
    json_response_obj = json_response_obj_factory(update_success_bool, refreshed_token_str);
    res.status(200).json(json_response_obj);

  }); // END UPDATE_PROFILE API ENDPOINT

  /********************************** NEXT API ENDPOINT ******************************************/

  // GET_MATCHES API ENDPOINT
  // INPUT: JSON OBJECT (email_str, output_select_str, access_token_str)
  // OUTPUT: JSON OBJECT (matches_array, refreshed_token_str)
  // A VALUE OF "e" FOR 'output_select_str' WILL GIVE AN EXTENDED VERSION OF 'matches_array'
  // ASK FOR AN "a" FOR 'output_select_str' FOR AN ABRIDGED VERSION OF 'matches_array'
  // ANY OTHER VALUE FOR 'output_select_str' WILL RESULT IN AN ABRIDGED VERSION OF 'matches_array'
  app.post('/api/get_matches', async (req, res, next) =>
  {

    /********************
    |  LOCAL VARIABLES  |
    *********************/
    let request_body_data;
    let user_email_str;
    let output_select_str;
    let user_access_token_str;

    // TO RETURN
    let abridged_matches_array;
    let matches_array = new Array();
    let refreshed_token_str;
    let json_response_obj;
    
    let database;
    let database_results_array;
    let collection_str;

    /********************
    |  LOCAL FUNCTIONS  |
    *********************/
    
    const json_response_obj_factory =
      function (matches_array, refreshed_token_str)
      {
        let json_response_obj =
          {
            matches_array : matches_array,
            refreshed_token_str : refreshed_token_str
          };
          
        return json_response_obj;
      };

    /*********************************************************************************************/
    
    // EXTRACT INFORMATION
    request_body_data = req.body;
    user_email_str = request_body_data.email_str;
    output_select_str = request_body_data.output_select_str;
    user_access_token_str = request_body_data.access_token_str;

    /*********************************************************************************************/

    // IF TOKEN IS NOT VALID
    if(!is_token_valid(user_access_token_str, user_email_str))
    {
      refreshed_token_str = "";
      
      json_response_obj =
        json_response_obj_factory(matches_array, refreshed_token_str);

      res.status(200).json(json_response_obj);
      return;
    }

    /*********************************************************************************************/
    // AT THIS POINT, WE CAN ASSUME THE ACCESS TOKEN IS VALID

    // IF FRONTEND NEVER PROVIDED AN OUTPUT SELECT OPTION
    if(output_select_str === undefined)
    {
      refreshed_token_str = create_refreshed_token(user_access_token_str);
      json_response_obj = json_response_obj_factory(matches_array, refreshed_token_str);
      res.status(200).json(json_response_obj);
      return;
    }

    /*********************************************************************************************/
    // AT THIS POINT, WE CAN ASSUME THAT WE HAVE A VALUE FOR OUTPUT SELECT

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
      refreshed_token_str = create_refreshed_token(user_access_token_str);
      json_response_obj = json_response_obj_factory(matches_array, refreshed_token_str);
      res.status(200).json(json_response_obj);
      return;
    }    

    /*********************************************************************************************/
    // AT THIS POINT, WE CAN ASSUME THE USER IS FOUND IN THE DATABASE

    // IF USER IS A GROUP
    if( is_this_collection_a_group(collection_str) )
    {
      abridged_matches_array = await find_individuals_that_match(user_email_str, database);
      
      // IF FRONTEND DID NOT SPECIFY 'e'XTENDED OUTPUT
      if(output_select_str.toLowerCase() !== "e")
      {
        refreshed_token_str = create_refreshed_token(user_access_token_str);
        json_response_obj = json_response_obj_factory(abridged_matches_array, refreshed_token_str);
        res.status(200).json(json_response_obj);
        return;
      }
      
      /*****************************************************************************/
      // AT THIS POINT, WE CAN ASSUME FRONTEND SPECIFIED EXTENDED OUTPUT
      
      for(let i = 0; i < abridged_matches_array.length; ++i)
      {
        matches_array.push( await create_extended_matches_obj(abridged_matches_array[i], database) );
      }
    }
    
    // OTHERWISE, USER IS AN INDIVIDUAL
    else
    {
      abridged_matches_array = await find_groups_that_match(user_email_str, database);
      
      // IF FRONTEND DID NOT SPECIFY 'e'XTENDED OUTPUT
      if(output_select_str.toLowerCase() !== "e")
      {
        refreshed_token_str = create_refreshed_token(user_access_token_str);
        json_response_obj = json_response_obj_factory(abridged_matches_array, refreshed_token_str);
        res.status(200).json(json_response_obj);
        return;
      }
      
      /*****************************************************************************/
      // AT THIS POINT, WE CAN ASSUME FRONTEND SPECIFIED EXTENDED OUTPUT
      
      for(let i = 0; i < abridged_matches_array.length; ++i)
      {
        matches_array.push( await create_extended_matches_obj(abridged_matches_array[i], database) );
      }
    }

    /*********************************************************************************************/

    refreshed_token_str = create_refreshed_token(user_access_token_str);
    json_response_obj = json_response_obj_factory(matches_array, refreshed_token_str);
    res.status(200).json(json_response_obj);

  }); // END GET_MATCHES API ENDPOINT

  /********************************** NEXT API ENDPOINT ******************************************/

  // SEND_PASSWORD_RESET API ENDPOINT
  // INPUT: JSON OBJECT (email_str)
  // OUTPUT: JSON OBJECT (success_bool)
  app.post('/api/send_password_reset', async (req, res, next) =>
  {

    /********************
    |  LOCAL VARIABLES  |
    *********************/
    let request_body_data;
    let user_email_str;

    // TO RETURN
    let send_success_bool;
    let json_response_obj;

    let database;
    let database_results_array;
    let collection_str;
    
    const EMAIL_SUBJECT_STR = "Password Reset Code From Kindling";
    const CODE_LENGTH_INT = 10;
    let msg_body_str;
    let pwd_reset_code_str;

    /*********************************************************************************************/

    // EXTRACT INFORMATION
    request_body_data = req.body;
    user_email_str = request_body_data.email_str;

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
      send_success_bool = false;
    }    

    // OTHERWISE, USER WAS FOUND IN DATABASE
    else
    {
        pwd_reset_code_str = create_code(CODE_LENGTH_INT);
       
        while( await does_this_code_exist(pwd_reset_code_str, database) )
        {
          pwd_reset_code_str = create_code(CODE_LENGTH_INT);
        }
        // AT THIS POINT, WE SHOULD HAVE A UNIQUE CODE
        
        msg_body_str = ("Your password reset code is: " + pwd_reset_code_str);
        
        await send_email(user_email_str, EMAIL_SUBJECT_STR, msg_body_str).then(
          function (resolved_value)
          {
            send_success_bool = resolved_value;
          },
          
          function(rejected_value)
          {
            send_success_bool = rejected_value;
          });
        
        // IF VERIFICATION EMAIL WAS SUCCESSFULLY SENT
        if(send_success_bool)
          save_password_reset_code(pwd_reset_code_str, user_email_str, database);
    }

    /*********************************************************************************************/

    json_response_obj = {success_bool : send_success_bool};

    res.status(200).json(json_response_obj);

  }); // END SEND_PASSWORD_RESET API ENDPOINT

  /********************************** NEXT API ENDPOINT ******************************************/

  // RESET_PASSWORD API ENDPOINT
  // INPUT: JSON OBJECT (code_str, new_password_str)
  // OUTPUT: JSON OBJECT (success_bool)
  app.post('/api/reset_password', async (req, res, next) =>
  {
  
    /********************
    |  LOCAL VARIABLES  |
    *********************/
    let request_body_data;
    let pwd_reset_code_str;
    let new_password_str;
    let user_email_str;

    // TO RETURN
    let reset_success_bool;
    let json_response_obj;

    let database;
    let database_results_array;
    let collection_str;
    const COLLECTION_4_CODE_STORAGE = "codes";
    
    /*********************************************************************************************/

    // EXTRACT INFORMATION
    request_body_data = req.body;
    pwd_reset_code_str = request_body_data.code_str;
    new_password_str = request_body_data.new_password_str;

    /*********************************************************************************************/

    // FIRST CHECK - MAKE SURE EMPTY STRING CANNOT BE ACCEPTED
    if(pwd_reset_code_str === "")
    {
      json_response_obj = {success_bool : false};
      res.status(200).json(json_response_obj);
      return;
    }

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

    /*********************************************************************************************/

    database_results_array = await
      database.collection(COLLECTION_4_CODE_STORAGE).
      find( {reset_code : pwd_reset_code_str} ).toArray();

    // IF THE CODE IS NOT CURRENTLY CONNECTED TO ANY USER
    if(database_results_array.length === 0)
      reset_success_bool = false;

    // OTHERWISE, THE CODE IS CONNECTED TO A USER
    else
    {
      // FIND USER CONNECTED TO THE CODE
      user_email_str = database_results_array[0].email;
      collection_str = await user_exists_in_this_collection(user_email_str, database);

      // IF USER COULD NOT BE FOUND IN DATABASE
      if(!collection_str)
      {
        reset_success_bool = false;
      }

      // OTHERWISE, USER WAS FOUND IN DATABASE
      else
      {
        try
        {
          // UPDATE THE USER'S PASSWORD
          database.collection(collection_str).updateOne( {email : user_email_str},
            { $set : {password : new_password_str} } );

          // CLEAR THE PASSWORD RESET CODE (SO IT CAN NOT BE USED MULTIPLE TIMES)
          database.collection(COLLECTION_4_CODE_STORAGE).updateOne(
            {email : user_email_str}, { $set : {reset_code : ""} } );

          reset_success_bool = true;
        }
        
        catch(error)
        {
          console.log(error.message);
          reset_success_bool = false;
        }
      }
    }

    /*********************************************************************************************/

    json_response_obj = {success_bool : reset_success_bool};

    res.status(200).json(json_response_obj);

  }); // END RESET_PASSWORD API ENDPOINT

  /********************************** NEXT API ENDPOINT ******************************************/

  // SHOVE_USER_INTO_DATABASE API ENDPOINT
  
  /****************************************************************** 
  |   INPUT: JSON OBJECT (is_group_bool, user_to_shove_obj)         |
  |                                                                 |
  |   IF USER TO SHOVE IS AN INDIVIDUAL:                            |
  |   {                                                             |
  |     email : some_string,                                        |
  |     password : some_string,                                     |
  |     display_name : some_string,                                 |
  |     phone : some_string,                                        |
  |     individual_categories : empty_obj,                          |
  |     description : some_string,                                  |
  |     candidate_group_categories : obj_of_category_booleans,      |
  |     ready_status : some_integer,                                |
  |     candidates : array_of_json_objects                          |
  |   }                                                             |
  |                                                                 |
  |   IF USER TO SHOVE IS A GROUP:                                  |
  |   {                                                             |
  |     email : some_string,                                        |
  |     password : some_string,                                     |
  |     display_name : some_string,                                 |
  |     phone : some_string,                                        |
  |     group_categories : empty_obj,                               |
  |     description : some_string,                                  |
  |     candidate_individual_categories : obj_of_category_booleans, |
  |     ready_status : some_integer,                                |
  |     candidates : array_of_json_objects                          |
  |   }                                                             |
  ******************************************************************/

  // OUTPUT: JSON OBJECT (success_bool)
  // NOT FOR PRODUCTION CODE - DEBUG/DEVELOPMENT PURPOSES ONLY
  app.post('/secret_api/shove_user_into_database', async (req, res, next) =>
  {
  
    /********************
    |  LOCAL VARIABLES  |
    *********************/
    let request_body_data;
    let is_group_bool;
    let user_to_shove_obj;

    // TO RETURN
    let shove_success_bool = false;
    let json_response_obj;

    let database;

    /*********************************************************************************************/

    // EXTRACT INFORMATION
    request_body_data = req.body;
    is_group_bool = request_body_data.is_group_bool;
    user_to_shove_obj = request_body_data.user_to_shove_obj;

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

    /*********************************************************************************************/

    // IF USER TO SHOVE IS A GROUP
    if(is_group_bool)
    {
      database.collection("groups").insertOne(user_to_shove_obj);
      shove_success_bool = true;
    }
    
    // OTHERWISE, USER TO SHOVE IS AN INDIVIDUAL
    else
    {
      database.collection("individuals").insertOne(user_to_shove_obj);
      shove_success_bool = true;
    }

    /*********************************************************************************************/

    json_response_obj = {success_bool : shove_success_bool};
    res.status(200).json(json_response_obj);

  }); // END SHOVE_USER_INTO_DATABASE

  /*********************************** END API ENDPOINTS *****************************************/

  /***************************************************
  |   USER-DEFINED FUNCTIONS                         |
  ----------------------------------------------------
  |  (in order of appearance)                        |
  |                                                  |
  |  individual_obj_factory                          |
  |  group_obj_factory                               |
  |  code_obj_factory                                |
  |  user_exists_in_this_collection                  |
  |  is_this_collection_a_group                      |
  |  extract_ready_status_from_user                  |
  |  this_user_has_this_password                     |
  |  is_token_valid                                  |
  |  create_refreshed_token                          |
  |  find_individuals_that_match                     |
  |  find_groups_that_match                          |
  |  create_extended_matches_obj                     |
  |  get_candidates_array                            |
  |  is_this_user_in_this_candidates_array           |
  |  send_email                                      |
  |  create_code                                     |
  |  create_code_character (helper for create_code)  |
  |  does_this_code_exist                            |
  |  save_verification_code                          |
  |  save_password_reset_code                        |
  ****************************************************/

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

  function code_obj_factory(verification_code_str, reset_code_str, user_email_str)
  {
    let code_obj =
    {
      verification_code : verification_code_str,
      reset_code : reset_code_str,
      email : user_email_str
    };
    
    return code_obj;
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
      console.log(error.message);
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

  /************************************* NEXT FUNCTION *******************************************/

  // RETURNS 'ready_status' FROM USER CORRESPONDING TO 'user_email_str'
  // RETURNS PHONY 'ready_status' IF USER COULD NOT BE FOUND IN DATABASE
  async function extract_ready_status_from_user(user_email_str, database)
  {
    let collection_str =
      await user_exists_in_this_collection(user_email_str, database);

    // IF USER COULD NOT BE FOUND IN DATABASE  
    if(!collection_str)
      return -1234;
      
    // AT THIS POINT, WE CAN ASSUME THAT THE USER EXISTS IN THE DATABASE
    let database_results_array =
      await database.collection(collection_str).find( {email : user_email_str} ).toArray();
      
    return database_results_array[0].ready_status;
  }

  /************************************* NEXT FUNCTION *******************************************/

  // RETURNS 'true' IF 'user_email_str' HAS A PASSWORD VALUE OF 'user_password_str', 'false'...
  // ...OTHERWISE
  // A VALID EMAIL IN THE DATABASE SHOULD EXIST AND BE PASSED AS 'user_email_str'
  // 'user_email_str' SHOULD EXIST AS A USER IN 'collection_str' COLLECTION OF THE DATABASE
  async function this_user_has_this_password(user_email_str, user_password_str,
    database, collection_str)
  {
    let database_results_array =
      await database.collection(collection_str).find(
      {email : user_email_str, password : user_password_str} ).toArray();
      
    if(database_results_array.length === 0)
      return false;
      
    return true;
  }

  /************************************* NEXT FUNCTION *******************************************/

  // RETURNS 'true' IF 'access_token_str' IS VALID, 'false' OTHERWISE
  // 'user_email_str' IS THE USER (PRIMARY SUBJECT) OF AN API ENDPOINT
  // 'disable_str' WILL DISABLE THE SECURITY FIX THAT RESOLVED THE ISSUE IN ALLOWING 'VALID'..
  // ..TOKENS TO BE USED FOR ANOTHER USER - TO DISABLE, ENTER A VALUE OF 'd' OR 'D'
  function is_token_valid(access_token_str, user_email_str, disable_str)
  {
    // IF THE SECURITY FIX HAS NOT BEEN DISABLED
    if(disable_str !== "d" && disable_str !== "D")
    {
      let jwt = require("jsonwebtoken");
      let user_data = jwt.decode(access_token_str, {complete:true});
      let email_str_from_token = user_data.payload.email_str;

      if(email_str_from_token !== user_email_str)
        return false;
    }

    /*****************************************************************/
    // AT THIS POINT, EVERYTHING IS THE SAME PRE SECURITY FIX

    let my_token_functions = require("./createJWT.js");

    try
    {
      if(my_token_functions.isExpired(access_token_str))
      {
        return false;
      }
      
      else
      {
        return true;
      }
    }
    
    catch(error)
    {
      console.log(error.message);
      return false;
    }
  }

  /************************************* NEXT FUNCTION *******************************************/

  // RETURNS AN ACCESS TOKEN STRING DERIVED FROM 'access_token_str' WITH NEW EXPIRATION DATE
  // IN THE CASE OF SOME SORT OF ERROR, EMPTY STRING IS RETURNED INSTEAD
  function create_refreshed_token(access_token_str)
  {
    let my_token_functions = require("./createJWT.js");
    let refreshed_token_str;
    
    try
    {
      refreshed_token_str = my_token_functions.refresh(access_token_str);
    }
    
    catch(error)
    {
      console.log(error.message);
      refreshed_token_str = "";
    }
    
    return refreshed_token_str;
  }

  /************************************* NEXT FUNCTION *******************************************/

  // RETURNS AN ARRAY OF EMAIL STRINGS OF INDIVIDUALS THAT MATCH WITH 'user_email_str'
  // 'user_email_str' IS ASSUMED TO EXIST IN 'database'
  // 'user_email_str' IS ASSUMED TO BE A GROUP
  // IF NO INDIVIDUALS COULD BE FOUND THAT MATCH, AN EMPTY ARRAY IS RETURNED
  async function find_individuals_that_match(user_email_str, database)
  {
    let email_array = new Array();
    let database_results_array;
    
    let user_candidates_array;
    let individual_candidates_array;

    /*************************************************************************************/

    database_results_array =
      await database.collection("groups").find( {email : user_email_str} ).toArray();

    user_candidates_array = database_results_array[0].candidates;

    /*************************************************************************************/

    // GET ALL DOCUMENTS IN THE INDIVIDUALS COLLECTION
    database_results_array =
      await database.collection("individuals").find().toArray();

    // GO THROUGH ALL DOCUMENTS IN THE INDIVIDUALS COLLECTION
    for(let i = 0; i < database_results_array.length; ++i)
    {
      individual_candidates_array = database_results_array[i].candidates;
      
      // GO THROUGH ALL CANDIDATES LISTED FOR THE INDIVIDUAL
      for(let j = 0; j < individual_candidates_array.length; ++j)
      {
        // IF IT'S A MATCH, SAVE THE INDIVIDUAL'S EMAIL
        if(individual_candidates_array[j].email === user_email_str)
        {
          if(individual_candidates_array[j].status >= 2 &&
            get_status_towards_this_user(
            database_results_array[i].email, user_candidates_array) >= 2)
          {
            email_array.push(database_results_array[i].email);
          }
          
          break;
        }
      }
      
    } // END GO THROUGH ALL DOCUMENTS IN INDIVIDUALS COLLECTION
    
    return email_array;
  }

  /************************************* NEXT FUNCTION *******************************************/

  // RETURNS AN ARRAY OF EMAIL STRINGS OF GROUPS THAT MATCH WITH 'user_email_str'
  // 'user_email_str' IS ASSUMED TO EXIST IN 'database'
  // 'user_email_str' IS ASSUMED TO BE AN INDIVIDUAL
  // IF NO GROUPS COULD BE FOUND THAT MATCH, AN EMPTY ARRAY IS RETURNED
  async function find_groups_that_match(user_email_str, database)
  {
    let email_array = new Array();
    let database_results_array;
    
    let user_candidates_array;
    let group_candidates_array;

    /*************************************************************************************/

    database_results_array =
      await database.collection("individuals").find( {email : user_email_str} ).toArray();

    user_candidates_array = database_results_array[0].candidates;

    /*************************************************************************************/

    // GET ALL DOCUMENTS IN THE GROUPS COLLECTION
    database_results_array =
      await database.collection("groups").find().toArray();

    // GO THROUGH ALL DOCUMENTS IN THE GROUPS COLLECTION
    for(let i = 0; i < database_results_array.length; ++i)
    {
      group_candidates_array = database_results_array[i].candidates;
      
      // GO THROUGH ALL CANDIDATES LISTED FOR THE GROUP
      for(let j = 0; j < group_candidates_array.length; ++j)
      {
        // IF IT'S A MATCH, SAVE THE GROUP'S EMAIL
        if(group_candidates_array[j].email === user_email_str)
        {
          if(group_candidates_array[j].status >= 2 &&
            get_status_towards_this_user(
            database_results_array[i].email, user_candidates_array) >= 2)
          {
            email_array.push(database_results_array[i].email);
          }
          
          break;
        }
      }
      
    } // END GO THROUGH ALL DOCUMENTS IN GROUPS COLLECTION
    
    return email_array;
  }
  
  /************************************* NEXT FUNCTION *******************************************/

  // RETURNS THE JSON OBJECT ELEMENTS FOR JOSEPH'S EXTENDED MATCHES ARRAY REQUEST FOR..
  // ..'get_matches' API
  // 'user_email_str' IS ASSUMED TO BE A VALID USER STORED IN 'database'
  async function create_extended_matches_obj(user_email_str, database)
  {
    let collection_str =
      await user_exists_in_this_collection(user_email_str, database);
      
    let database_results_array =
      await database.collection(collection_str).find( {email : user_email_str} ).toArray();
    
    // EXTENDED INFORMATION
    let display_name_str;
    let phone_str;
      
    display_name_str = database_results_array[0].display_name;
    phone_str = database_results_array[0].phone;
    
    let extended_matches_obj =
      {
        email_str : user_email_str,
        display_name_str : display_name_str,
        phone_str : phone_str
      };
      
    return extended_matches_obj;
  }

  /************************************* NEXT FUNCTION *******************************************/

  // RETURNS THE CANDIDATES ARRAY OF 'user_email_str'
  // 'user_email_str' IS ASSUMED TO EXIST IN 'database' IN THE COLLECTION 'collection_str'
  async function get_candidates_array(user_email_str, collection_str, database)
  {
    let database_results_array =
      await database.collection(collection_str).find( {email : user_email_str} ).toArray();
      
    let user_candidates_array = database_results_array[0].candidates;
    return user_candidates_array;
  }
  
  /************************************* NEXT FUNCTION *******************************************/

  // CHECKS TO SEE IF 'email_str' IS FOUND IN 'candidates_array'
  // IF FOUND, RETURNS THE ARRAY INDEX IN 'candidates_array'
  // IF NOT FOUND, RETURNS -1
  function is_this_user_in_this_candidates_array(email_str, candidates_array)
  {
    let array_index = -1;
    
    // GO THROUGH ALL CANDIDATES
    for(let i = 0; i < candidates_array.length; ++i)
    {
      // IF 'email_str' IS THE CANDIDATE
      if(candidates_array[i].email === email_str)
      {
        array_index = i;
        break;
      }
    }
    
    return array_index;
  }

  /************************************* NEXT FUNCTION *******************************************/

  // GOES THROUGH 'candidates_array' TO FIND THE STATUS CODE AKA SWIPE STATUS TOWARDS..
  // ..'user_email_str'
  // RETURNS -1 IF 'candidates_array' IS EMPTY, OR IF 'user_email_str' IS NOT AN ENTRY IN..
  // ..'candidates_array'
  function get_status_towards_this_user(user_email_str, candidates_array)
  {
    let status_int = -1;
    
    // GO THROUGH ALL CANDIDATES
    for(let i = 0; i < candidates_array.length; ++i)
    {
      if(candidates_array[i].email === user_email_str)
      {
        status_int = candidates_array[i].status;
        break;
      }
    }
    
    return status_int;
  }

  /************************************* NEXT FUNCTION *******************************************/

  // SENDS EMAIL FROM KINDLING GMAIL ACCOUNT
  // RETURNS A PROMISE RESOLVING TO 'true', REJECTING TO 'false
  function send_email(sendto_address_str, subject_str, msg_body_str)
  {
    const nodemailer = require("nodemailer");
    const USER = "kindling.largeproject@gmail.com";
    const PASSWORD = "fireaway23";

    let mail_transporter = nodemailer.createTransport(
      {
        service : "gmail",
        auth : {user : USER, pass : PASSWORD}
      } );
      
    let mail_details =
      {
        from : USER,
        to : sendto_address_str,
        subject : subject_str,
        text : msg_body_str
      };

    let my_promise = new Promise(function (resolve, reject)
      {
        mail_transporter.sendMail(mail_details, function(error, data)
          {
            if(error)
            {
              reject(false);
            }
            else
              resolve(true);
          });        
      }
    );

    return my_promise;
  }

  /************************************* NEXT FUNCTION *******************************************/

  // RETURNS A CODE STRING OF 'number_of_characters_int' LENGTH
  function create_code(number_of_characters_int)
  {
    let new_code_str = "";
    let current_index_int = 0;

    while(current_index_int < number_of_characters_int)
    {
      new_code_str += create_code_character();
      ++current_index_int;
    }

    return new_code_str;
  }

  /************************************* NEXT FUNCTION *******************************************/

  // RANDOMLY RETURNS A CHARACTER FROM 'code_character_array'
  function create_code_character()
  {
    const code_character_array =
    ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
     "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
     "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", 
     "u", "v", "w", "x", "y", "z"];

    let random_array_index = Math.floor(
      Math.random() * code_character_array.length);

    return code_character_array[random_array_index];
  }

  /************************************* NEXT FUNCTION *******************************************/

  // RETURNS 'true' IF 'verification_code_str' ALREADY EXISTS IN 'database', 'false' OTHERWISE
  async function does_this_code_exist(verification_code_str, database)
  {
    const COLLECTION_NAME_FOR_STORED_CODES = "codes";
  
    let database_results_array =
      await database.collection(COLLECTION_NAME_FOR_STORED_CODES).
        find( {verification_code : verification_code_str} ).toArray();
    
    // IF THE CODE EXISTS ALREADY FOR VERIFICATION PURPOSES
    if(database_results_array.length > 0)
      return true;

    // CONTINUE SEARCH
    database_results_array =
      await database.collection(COLLECTION_NAME_FOR_STORED_CODES).
        find( {reset_code : verification_code_str} ).toArray();

    // IF THE CODE EXISTS ALREADY FOR PASSWORD RESET PURPOSES
    if(database_results_array.length > 0)
      return true;

    // AT THIS POINT, WE CAN ASSUME THAT THE CODE DOES NOT EXIST IN ANY CAPACITY
    return false;
  }
  
  /************************************* NEXT FUNCTION *******************************************/

  // SAVES 'verification_code_str' INTO THE DATABASE
  async function save_verification_code(verification_code_str, user_email_str, database)
  {
    const COLLECTION_NAME_FOR_STORED_CODES = "codes";
  
    let database_results_array =
      await database.collection(COLLECTION_NAME_FOR_STORED_CODES).find( {email : user_email_str} ).toArray();

    // IF THERE IS CURRENTLY NO CODE ENTRY FOR THE USER
    if(database_results_array.length === 0)
    {
      database.collection(COLLECTION_NAME_FOR_STORED_CODES).insertOne
        ( code_obj_factory(verification_code_str, "", user_email_str) );
    }
    
    // OTHERWISE, THE USER ALREADY EXISTS IN THE 'codes' COLLECTION
    else
    {
      database.collection(COLLECTION_NAME_FOR_STORED_CODES).updateOne( {email : user_email_str},
        { $set : {verification_code : verification_code_str} } );
    }
  }

  /************************************* NEXT FUNCTION *******************************************/

  // SAVES 'pwd_reset_code_str' INTO THE DATABASE
  async function save_password_reset_code(pwd_reset_code_str, user_email_str, database)
  {
    const COLLECTION_NAME_FOR_STORED_CODES = "codes";
    
    let database_results_array =
      await database.collection(COLLECTION_NAME_FOR_STORED_CODES).find( {email : user_email_str} ).toArray();
      
    // IF THERE IS CURRENTLY NO CODE ENTRY FOR THE USER
    if(database_results_array.length === 0)
    {
      database.collection(COLLECTION_NAME_FOR_STORED_CODES).insertOne
        ( code_obj_factory("", pwd_reset_code_str, user_email_str) );
    }
    
    // OTHERWISE, THE USER ALREADY EXISTS IN THE 'codes' COLLECTION
    else
    {
      database.collection(COLLECTION_NAME_FOR_STORED_CODES).updateOne( {email : user_email_str},
        { $set : {reset_code : pwd_reset_code_str} } );
    }
  }

}; // END setApp