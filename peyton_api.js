// FUNCTION PARAMETERS 'app' AND 'client' ARE PASSED IN FROM 'server.js' WHICH YOU CAN ASSUME ARE SET UP CORRECTLY
exports.setApp = function(app, client)
{

  // THIS WOULD BE LIKE A SEPARATE .php FILE IN THE SMALL PROJECT
  // THIS LETS US RESPOND TO POST REQUESTS TO THE SERVER
  // IF YOU WANTED TO RESPOND TO GET REQUESTS, IT WOULD BE 'app.get' INSTEAD
  app.post('/api/<enter your api name here>', async (req, res, next) =>
  {
    // ENTER YOUR API LOGIC HERE
  });

}; // END setApp