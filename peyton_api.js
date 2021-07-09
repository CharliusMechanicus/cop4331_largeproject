// FUNCTION PARAMETERS 'app' AND 'client' ARE PASSED IN FROM 'server.js' WHICH YOU CAN ASSUME ARE SET UP CORRECTLY
exports.setApp = function(app, client)
{

  // THIS WOULD BE LIKE A SEPARATE .php FILE IN THE SMALL PROJECT
  // THIS LETS US RESPOND TO POST REQUESTS TO THE SERVER
  // IF YOU WANTED TO RESPOND TO GET REQUESTS, IT WOULD BE 'app.get' INSTEAD
  // -- GET_PROFILE_INDIVIDUAL --
    app.post('/api/get_profile_individual', async (req, res, next) =>
    {
    let request_body_data;
  	let user_email_str;
  	let user_access_token_str;

  	let get_status_sucess_bool;
  	let user_display_name_str;
  	let user_description_str;
  	let refreshed_token_str;
  	let json_response_obj;

  	let database;
      let database_results_array;
  	let collection_str;

  	// Response Object Function
  	const json_response_obj_factory =
        function (success_bool, display_name_str, description_str, refreshed_token_str)
        {
          let json_response_obj =
            {
              success_bool : success_bool,
              display_name_str : display_name_str,
  			      description_str : description_str,
              refreshed_token_str : refreshed_token_str
            };

          return json_response_obj;
        };

  	const error_no_token =
  		function ()
  		{
  			return json_response_obj_factory(false, "", "", "");
  		}

  	const error_yes_token =
  		function ()
  		{
  			return json_response_obj_factory(false, "", "", create_refreshed_token(user_access_token_str));
  		}

  	// Parse Data
  	request_body_data = req.body;
  	user_email_str = request_body_data.email_str;
  	user_access_token_str = request_body_data.access_token_str;

  	// Check Token
  	if(!is_token_valid(user_access_token_str))
      {
        json_response_obj = error_no_token();

        res.status(200).json(json_response_obj);
        return;
      }

  	// Connect to db
  	try
      {
        database = client.db();
      }
      catch(error)
      {
        console.log(error.message);
      }

  	try
    {
      console.log("trying user_exists_in_this_collection");
      collection_str = await user_exists_in_this_collection(user_email_str, database);
    }
    catch(error)
    {
      console.log("failed user_exists_in_this_collection");
      json_response_obj = error_yes_token();
    }
    console.log("succeeded user_exists_in_this_collection");
  	if(!collection_str)
      {
        json_response_obj = error_yes_token();

        res.status(200).json(json_response_obj);
        return;
      }
  	else
  	{
  		try
  		{
  			database_results_array =
  				await database.collection(collection_str).find( {email : user_email_str} ).toArray();
      }
    	catch(error)
    	{
    		json_response_obj = error_yes_token();
    	}
  		json_response_obj =
  			json_response_obj_factory(
  				true,
  				database_results_array[0].display_name_str,
  				database_results_array[0].description_str,
  				create_refreshed_token(user_access_token_str));


  	}
  	res.status(200).json(json_response_obj);
    });


    // -- GET_PROFILE_GROUP --
    app.post('/api/get_profile_group', async (req, res, next) =>
    {
      let request_body_data;
  	let user_email_str;
  	let user_access_token_str;

  	let get_status_sucess_bool;
  	let user_display_name_str;
  	let user_description_str;
  	let refreshed_token_str;
  	let json_response_obj;

  	let database;
      let database_results_array;
  	let collection_str;

  	// Response Object Function
  	const json_response_obj_factory =
        function (success_bool, display_name_str, description_str, refreshed_token_str)
        {
          let json_response_obj =
            {
              success_bool : success_bool,
              display_name_str : display_name_str,
  			description_str : description_str,
              refreshed_token_str : refreshed_token_str
            };

          return json_response_obj;
        };

  	const error_no_token =
  		function ()
  		{
  			return json_response_obj_factory(false, "", "", "");
  		}

  	const error_yes_token =
  		function ()
  		{
  			return json_response_obj_factory(false, "", "", create_refreshed_token(user_access_token_str));
  		}

  	// Parse Data
  	request_body_data = req.body;
  	user_email_str = request_body_data.email_str;
  	user_access_token_str = request_body_data.access_token_str;

  	// Check Token
  	if(!is_token_valid(user_access_token_str))
      {
        json_response_obj = error_no_token();

        res.status(200).json(json_response_obj);
        return;
      }

  	// Connect to db
  	try
      {
        database = client.db();
      }
      catch(error)
      {
        console.log(error.message);
      }

  	collection_str = await user_exists_in_this_collection(user_email_str, database);

  	if(!collection_str)
      {
        json_response_obj = error_yes_token();

        res.status(200).json(json_response_obj);
        return;
      }
  	else
  	{
  		try
  		{
  			database_results_array =
  				await database.collection(collection_str).find( {email : user_email_str} ).toArray();

  			json_response_obj =
  				json_response_obj_factory(
  					true,
  					database_results_array[0].display_name,
  					database_results_array[0].description,
  					create_refreshed_token(user_access_token_str));
  		}
  		catch(error)
  		{
  			json_response_obj = error_yes_token();
  		}

  	}
  	res.status(200).json(json_response_obj);
    });


    // -- SWIPE_LEFT --
    app.post('/api/swipe_left', async (req, res, next) =>
    {
      let request_body_data;
  	let user_email_str;
  	let user_target_email_str;
  	let user_access_token_str;

  	let get_status_sucess_bool;
  	let refreshed_token_str;
  	let json_response_obj;

  	let database;
      let database_results_array;
  	let candidates_obj_array;
  	let candidates_index = -1;
  	let collection_str;
    let opposite_collection_str;

  	// Response Object Function
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

  	const error_no_token =
  		function ()
  		{
  			return json_response_obj_factory(false, "");
  		}

  	const error_yes_token =
  		function ()
  		{
  			return json_response_obj_factory(false, create_refreshed_token(user_access_token_str));
  		}

  	// Parse Data
  	request_body_data = req.body;
  	user_email_str = request_body_data.email_str;
  	user_target_email_str = request_body_data.target_email_str;
  	user_access_token_str = request_body_data.access_token_str;

  	// Check Token
  	if(!is_token_valid(user_access_token_str))
      {
        json_response_obj = error_no_token();

        res.status(200).json(json_response_obj);
        return;
      }

  	// Connect to db
  	try
      {
        database = client.db();
      }
      catch(error)
      {
        console.log(error.message);
      }

      collection_str = await user_exists_in_this_collection(user_email_str, database);
      opposite_collection_str = await user_exists_in_this_collection(user_target_email_str, database);
    	if(!collection_str || !opposite_collection_str || collection_str == opposite_collection_str)
        {
          json_response_obj = error_yes_token();

          res.status(200).json(json_response_obj);
          return;
        }
  	else
  	{
  		try
  		{
  			database_results_array =
  				await database.collection(collection_str).find( {email : user_email_str} ).toArray();
      }
    	catch
    	{
    		json_response_obj = error_yes_token();
        res.status(202).json(json_response_obj);
    	}

  			candidates_obj_array = database_results_array[0].candidates;

  			for(let x = 0; x < candidates_obj_array.length; x++)
  			{
  				if(candidates_obj_array[x].email == user_target_email_str)
  				{
  					candidates_index = x;
  					break;
  				}
  			}
  			if(candidates_index == -1)
  			{
  				let new_json_obj =
  				{
  					email : user_target_email_str,
  					status : 1
  				};
  				candidates_obj_array.push(new_json_obj);
  			}
  			else
  			{
  				candidates_obj_array[candidates_index].status = 1;
  			}

  			try
  			{
  				database.collection(collection_str).updateOne( {email : user_email_str},
  					{ $set : {candidates : candidates_obj_array} } );

  				json_response_obj =
  					json_response_obj_factory(
  						true,
  						create_refreshed_token(user_access_token_str));
  			}
  			catch
  			{
  				json_response_obj = error_yes_token();
          res.status(201).json(json_response_obj);
  			}


  	}
  	res.status(200).json(json_response_obj);
    });


    // -- SWIPE_RIGHT --
    app.post('/api/swipe_right', async (req, res, next) =>
    {
      let request_body_data;
  	let user_email_str;
  	let user_target_email_str;
  	let user_access_token_str;

  	let get_status_sucess_bool;
  	let refreshed_token_str;
  	let match_bool = false;
  	let json_response_obj;

  	let database;
      let database_results_array;
  	let candidates_obj_array;
  	let candidates_index = -1;
  	let collection_str;
  	let opposite_collection_str;

  	// Response Object Function
  	const json_response_obj_factory =
        function (success_bool, match_bool, refreshed_token_str)
        {
          let json_response_obj =
            {
              success_bool : success_bool,
  			match_bool : match_bool,
              refreshed_token_str : refreshed_token_str
            };

          return json_response_obj;
        };

  	const error_no_token =
  		function ()
  		{
  			return json_response_obj_factory(false, false, "");
  		}

  	const error_yes_token =
  		function ()
  		{
  			return json_response_obj_factory(false, false, create_refreshed_token(user_access_token_str));
  		}

  	// Parse Data
  	request_body_data = req.body;
  	user_email_str = request_body_data.email_str;
  	user_target_email_str = request_body_data.target_email_str;
  	user_access_token_str = request_body_data.access_token_str;

  	// Check Token
  	if(!is_token_valid(user_access_token_str))
      {
        json_response_obj = error_no_token();

        res.status(200).json(json_response_obj);
        return;
      }

  	// Connect to db
  	try
      {
        database = client.db();
      }
      catch(error)
      {
        console.log(error.message);
      }

  	collection_str = await user_exists_in_this_collection(user_email_str, database);
    opposite_collection_str = await user_exists_in_this_collection(user_target_email_str, database);
  	if(!collection_str || !opposite_collection_str || collection_str == opposite_collection_str)
      {
        json_response_obj = error_yes_token();

        res.status(200).json(json_response_obj);
        return;
      }
  	else
  	{
  		try
  		{
  			database_results_array =
  				await database.collection(collection_str).find( {email : user_email_str} ).toArray();
      }
    	catch
    	{
    		json_response_obj = error_yes_token();
        res.status(201).json(json_response_obj);
    	}

  			candidates_obj_array = database_results_array[0].candidates;

  			for(let x = 0; x < candidates_obj_array.length; x++)
  			{
  				if(candidates_obj_array[x].email == user_target_email_str)
  				{
  					candidates_index = x;
  					break;
  				}
  			}
  			if(candidates_index == -1)
  			{
  				let new_json_obj =
  				{
  					email : user_target_email_str,
  					status : 2
  				};
  				candidates_obj_array.push(new_json_obj);
          candidates_index = candidates_obj_array.length - 1;
  			}
  			else
  			{
  				candidates_obj_array[candidates_index].status = 2;
  			}

  			try
  			{
  				database_results_array =
  					await database.collection(opposite_collection_str).find().toArray();
        }
    		catch
    		{
    			json_response_obj = error_yes_token();
          res.status(202).json(json_response_obj);
    		}

  				for(x = 0; x < database_results_array.length; x++)
  				{
  					for(let y = 0; y < database_results_array[x].candidates.length; y++)
  					{
  						if(database_results_array[x].candidates[y].email == user_email_str)
  						{
  							if(database_results_array[x].candidates[y].status == 2)
  							{
  								match_bool = true;
  								candidates_obj_array[candidates_index].status = 3;
  							}
  							break;
  						}
  					}
  				}


  				try
  				{
  					database.collection(collection_str).updateOne( {email : user_email_str},
  						{ $set : {candidates : candidates_obj_array} } );

  					json_response_obj =
  						json_response_obj_factory(
  							true,
  							match_bool,
  							create_refreshed_token(user_access_token_str));
  				}
  				catch
  				{
  					json_response_obj = error_yes_token();
            res.status(203).json(json_response_obj);
  				}

  	}
  	res.status(200).json(json_response_obj);
    });

    // -- GLOBAL FUNCTIONS --
    function is_token_valid(access_token_str)
    {
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
    // --
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
    // --
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
    // --
    function is_this_collection_a_group(collection_str)
    {
      if(collection_str === "groups")
        return true;

      else
        return false;
    }

}; // END setApp
>>>>>>> Stashed changes
