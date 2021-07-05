/****************************
| COMPOSED BY: CHARLIE TAN  |
*****************************/

exports.setApp = function(app, client)
{

  // REGISTER API ENDPOINT
  // INPUT: JSON OBJECT (email_str, password_str, is_group_bool)
  // OUTPUT: JSON OBJECT (success_bool, email_str, is_group_bool)
  app.post('/api/register', async (req, res, next) =>
  {
  
    /********************
    |  LOCAL VARIABLES  |
    *********************/
    let request_body_data;
    let user_email_str;
    let user_password_str;
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
            (user_email_str, user_password_str, "", "", {}, "", {}, 0, new Array) );
        }
      
        else
        {
          // SIGN THEM UP AS A GROUP
          database.collection("groups").insertOne(
            group_obj_factory
            (user_email_str, user_password_str, "", "", {}, "", {}, 0, new Array) );
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

    json_response_obj = {registration_success_bool, user_email_str, user_isgroup_bool};
    res.status(200).json(json_response_obj);
    
  }); // END REGISTER API ENDPOINT

  /***********************************************************************************************/

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

}; // END setApp