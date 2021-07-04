/*********************
|  SCRIPT CONSTANTS  |
**********************/
const APP_NAME = 'kindling-lp'; // KINDLING LARGE PROJECT

/******************************************************************************/

// TO BE USED FOR FRONTEND'S FETCH FUNCTIONS WHICH ACCESS THE API'S
exports.buildPath =
function buildPath(route)
{
    // IF APP IS DEPLOYED
    if (process.env.NODE_ENV === 'production') 
    {
        return 'https://' + APP_NAME +  '.herokuapp.com/' + route;
    }
    
    else
    {        
        return 'http://localhost:5000/' + route;
    }
}