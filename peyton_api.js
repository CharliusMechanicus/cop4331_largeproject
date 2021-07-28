// FUNCTION PARAMETERS 'app' AND 'client' ARE PASSED IN FROM 'server.js' WHICH YOU CAN ASSUME ARE SET UP CORRECTLY
exports.setApp = function(app, client)
{

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
        function (success_bool, display_name_str, description_str, phone_str, refreshed_token_str)
        {
          let json_response_obj =
            {
              success_bool : success_bool,
              display_name_str : display_name_str,
			        description_str : description_str,
			        phone_str : phone_str,
              refreshed_token_str : refreshed_token_str
            };

          return json_response_obj;
        };

  	const error_no_token =
  		function ()
  		{
  			return json_response_obj_factory(false, "", "", "", "");
  		}

  	const error_yes_token =
  		function ()
  		{
  			return json_response_obj_factory(false, "", "", "", create_refreshed_token(user_access_token_str));
  		}

  	// Parse Data
  	request_body_data = req.body;
  	user_email_str = request_body_data.email_str;
  	user_access_token_str = request_body_data.access_token_str;

  	// Check Token
  	if(!is_token_valid(user_access_token_str, user_email_str, "d"))
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
					database_results_array[0].phone,
  					create_refreshed_token(user_access_token_str));
  		}
  		catch(error)
  		{
  			json_response_obj = error_yes_token();
  		}

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
        function (success_bool, display_name_str, description_str, phone_str, refreshed_token_str)
        {
          let json_response_obj =
            {
              success_bool : success_bool,
              display_name_str : display_name_str,
			  description_str : description_str,
			  phone_str : phone_str,
              refreshed_token_str : refreshed_token_str
            };

          return json_response_obj;
        };

  	const error_no_token =
  		function ()
  		{
  			return json_response_obj_factory(false, "", "", "", "");
  		}

  	const error_yes_token =
  		function ()
  		{
  			return json_response_obj_factory(false, "", "", "", create_refreshed_token(user_access_token_str));
  		}

  	// Parse Data
  	request_body_data = req.body;
  	user_email_str = request_body_data.email_str;
  	user_access_token_str = request_body_data.access_token_str;

  	// Check Token
  	if(!is_token_valid(user_access_token_str, user_email_str, "d"))
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
					database_results_array[0].phone,
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
  	if(!is_token_valid(user_access_token_str, user_email_str))
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
  	if(!is_token_valid(user_access_token_str, user_email_str))
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
        res.status(200).json(json_response_obj);
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
        res.status(200).json(json_response_obj);
    }

  	for(x = 0; x < database_results_array.length; x++)
  	{
		if(database_results_array[x].email == user_target_email_str)
		{
  		for(let y = 0; y < database_results_array[x].candidates.length; y++)
  		{
  			if(database_results_array[x].candidates[y].email == user_email_str)
  			{
				if(database_results_array[x].candidates[y].status == 2 || database_results_array[x].candidates[y].status == 3)
  				{
					console.log("New");
					console.log(database_results_array[x].email);
					console.log(database_results_array[x].candidates[y].email);
  					match_bool = true;
  					candidates_obj_array[candidates_index].status = 3;
  				}
  				break;
  			}
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
		res.status(200).json(json_response_obj);
		return;
  	}
  	catch
  	{
  		json_response_obj = error_yes_token();
        res.status(200).json(json_response_obj);
		return;
  	}
	}
  	res.status(200).json(json_response_obj);
    });

   // -- GET_CANDIDATE --
    app.post('/api/get_candidate', async (req, res, next) =>
    {
    let request_body_data;
  	let user_email_str;
  	let user_access_token_str;
	let user_is_group_bool;

  	let get_status_sucess_bool;
  	let refreshed_token_str;
  	let email_str;
  	let json_response_obj;

  	let database;
    let database_results_array;
	let candidates_results_array;
  	let collection_str;
  	let opposite_collection_str;
	let canddiates;
	let candidates_new;

  	// Response Object Function
  	const json_response_obj_factory =
        function (success_bool, email_str, refreshed_token_str)
        {
          let json_response_obj =
            {
              success_bool : success_bool,
			  email_str : email_str,
              refreshed_token_str : refreshed_token_str
            };

          return json_response_obj;
        };

  	const error_no_token =
  		function ()
  		{
  			return json_response_obj_factory(false, "", "");
  		}

  	const error_yes_token =
  		function ()
  		{
  			return json_response_obj_factory(false, "", create_refreshed_token(user_access_token_str));
  		}

  	// Parse Data
  	request_body_data = req.body;
  	user_email_str = request_body_data.email_str;
	user_is_group_bool = request_body_data.is_group_bool;
  	user_access_token_str = request_body_data.access_token_str;

  	// Check Token
  	if(!is_token_valid(user_access_token_str, user_email_str))
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
    if(collection_str == "groups")
	{
		opposite_collection_str = "individuals";
	}
	else
	{
		opposite_collection_str = "groups";
	}
  	if(!collection_str || !opposite_collection_str || collection_str == opposite_collection_str)
    {
      json_response_obj = error_yes_token();

      res.status(200).json(json_response_obj);
      return;
    }

  	try
	{
  		database_results_array =
  		await database.collection(collection_str).find( {email : user_email_str} ).toArray();
    }
    catch
    {
    	json_response_obj = error_yes_token();
        res.status(200).json(json_response_obj);
		return;
    }
  	user = database_results_array[0];

	try
	{
  		candidate_results_array =
  		await database.collection(opposite_collection_str).find({ready_status : 2}).toArray();
    }
    catch
    {
    	json_response_obj = error_yes_token();
        res.status(200).json(json_response_obj);
		return;
    }
  	candidates = candidate_results_array;
	candidates_new = [];

	for(let x  = 0; x < candidates.length; x++)
	{
		if(user_is_group_bool == true)
		{
			if(
				(user.candidate_individual_categories.game_development_bool && candidates[x].candidate_group_categories.game_development_bool ) ||
				(user.candidate_individual_categories.app_development_bool && candidates[x].candidate_group_categories.app_development_bool ) ||
				(user.candidate_individual_categories.web_development_bool && candidates[x].candidate_group_categories.web_development_bool ) ||
				(user.candidate_individual_categories.robotics_bool && candidates[x].candidate_group_categories.robotics_bool ) ||
				(user.candidate_individual_categories.graphic_design_bool && candidates[x].candidate_group_categories.graphic_design_bool ) ||
				(user.candidate_individual_categories.writer_bool && candidates[x].candidate_group_categories.writer_bool ) ||
				(user.candidate_individual_categories.marketing_bool && candidates[x].candidate_group_categories.marketing_bool ) ||
				(user.candidate_individual_categories.networking_bool && candidates[x].candidate_group_categories.networking_bool ) ||
				(user.candidate_individual_categories.construction_bool && candidates[x].candidate_group_categories.construction_bool ) ||
				(user.candidate_individual_categories.lab_partners_bool && candidates[x].candidate_group_categories.lab_partners_bool ) ||
				(user.candidate_individual_categories.research_bool && candidates[x].candidate_group_categories.research_bool ) ||
				(user.candidate_individual_categories.other_bool && candidates[x].candidate_group_categories.other_bool )
			)
			{
				candidates_new.push(candidates[x]);
			}
		}
		else
		{
			if(
				(user.candidate_group_categories.game_development_bool && candidates[x].candidate_individual_categories.game_development_bool ) ||
				(user.candidate_group_categories.app_development_bool && candidates[x].candidate_individual_categories.app_development_bool ) ||
				(user.candidate_group_categories.web_development_bool && candidates[x].candidate_individual_categories.web_development_bool ) ||
				(user.candidate_group_categories.robotics_bool && candidates[x].candidate_individual_categories.robotics_bool ) ||
				(user.candidate_group_categories.graphic_design_bool && candidates[x].candidate_individual_categories.graphic_design_bool ) ||
				(user.candidate_group_categories.writer_bool && candidates[x].candidate_individual_categories.writer_bool ) ||
				(user.candidate_group_categories.marketing_bool && candidates[x].candidate_individual_categories.marketing_bool ) ||
				(user.candidate_group_categories.networking_bool && candidates[x].candidate_individual_categories.networking_bool ) ||
				(user.candidate_group_categories.construction_bool && candidates[x].candidate_individual_categories.construction_bool ) ||
				(user.candidate_group_categories.lab_partners_bool && candidates[x].candidate_individual_categories.lab_partners_bool ) ||
				(user.candidate_group_categories.research_bool && candidates[x].candidate_individual_categories.research_bool ) ||
				(user.candidate_group_categories.other_bool && candidates[x].candidate_individual_categories.other_bool )
			)
			{
				candidates_new.push(candidates[x]);
			}
		}
	}

	for(x = 0; x < candidates_new.length; x++)
	{
		if(get_status(candidates_new[x], user_email_str, user_is_group_bool == false) == 2)
		{
			if(get_status(user, candidates_new[x].email, user_is_group_bool) == 0)
			{
				json_response_obj = json_response_obj_factory(true, candidates_new[x].email, create_refreshed_token(user_access_token_str));
				res.status(200).json(json_response_obj);
				return;
			}
		}
	}

	for(x = 0; x < candidates_new.length; x++)
	{
		if(get_status(candidates_new[x], user_email_str, user_is_group_bool == false) == 0)
		{
			if(get_status(user, candidates_new[x].email, user_is_group_bool) == 0)
			{
				json_response_obj = json_response_obj_factory(true, candidates_new[x].email, create_refreshed_token(user_access_token_str));
				res.status(200).json(json_response_obj);
				return;
			}
		}
	}

	let reset = false;

	for(x = 0; x < candidates_new.length; x++)
	{
		if(get_status(candidates_new[x], user_email_str, user_is_group_bool == false) == 0 || get_status(candidates_new[x], user_email_str, user_is_group_bool == false) == 2)
		{
			if(get_status(user, candidates_new[x].email, user_is_group_bool) == 1)
			{
				reset = true;
				set_status(user, candidates_new[x].email, user_is_group_bool, 0);
			}
		}
	}

  reset = false;

	if(reset == false)
	{
		json_response_obj = error_yes_token();
        res.status(200).json(json_response_obj);
		return;
	}

	for(x = 0; x < candidates_new.length; x++)
	{
		if(get_status(candidates_new[x], user_email_str, user_is_group_bool == false) == 2)
		{
			if(get_status(user, candidates_new[x].email, user_is_group_bool) == 0)
			{
				json_response_obj = json_response_obj_factory(true, candidates_new[x].email, create_refreshed_token(user_access_token_str));
				res.status(200).json(json_response_obj);
				return;
			}
		}
	}

	for(x = 0; x < candidates_new.length; x++)
	{
		if(get_status(candidates_new[x], user_email_str, user_is_group_bool == false) == 0)
		{
			if(get_status(user, candidates_new[x].email, user_is_group_bool) == 0)
			{
				json_response_obj = json_response_obj_factory(true, candidates_new[x].email, create_refreshed_token(user_access_token_str));
				res.status(200).json(json_response_obj);
				return;
			}
		}
	}




	json_response_obj = error_yes_token();
  	res.status(200).json(json_response_obj);
	return;
    });

    // -- GLOBAL FUNCTIONS --
	function set_status(json, email, is_group, stat)
	{
		for(let x  = 0; x < json.candidates.length; x++)
		{
			if(json.candidates[x].email == email)
			{
				json.candidates[x].status = stat;
				return;
			}
		}
		return;
	}
	function get_status(json, email, is_group)
	{
		for(let x  = 0; x < json.candidates.length; x++)
		{
			if(json.candidates[x].email == email)
			{
				return json.candidates[x].status;
			}
		}
		return 0;
	}

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
