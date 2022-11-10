const { supabase } = require("../utils/database");
const axios = require('axios');
const dotenv = require("dotenv").config();

const API_ENDPOINT = "https://nwdb.info/server-status/servers_24h.json";



exports.handler = async (event, context) => {

  const config = {
    method: 'get',
    headers: { 
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36",
    }
  };

  let response
  try {
    response = await axios.get(API_ENDPOINT, config)
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({
        error: err.message
      })
    }
  }

  try {

    const { data, error } = await supabase
    .from("new_world_queue")
    .update({
      updated_at: new Date().toISOString().toLocaleString('en-US'),
      server_json: response.data
    })
    .match({
      id: 1
    })
    console.log("Data added to supabase");

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: data
      })
    }
    
  } catch (error) {
    console.log(error);
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({
        error: err.message
      })
    }
  }


}





  // try {
    

  // //  const serverData = await fetch(serverUrl, config)
  // //   .then((res) =>  res.json())
  // //   .catch((err) => console.log(err));

  // // const response = await fetch(serverUrl);
  // // const serverData = await response.text();

  //   console.log(serverData);
    
  
  //   // let serverLocked =

  //   //   console.log(serverLocked);
  //   //   if(serverLocked === null) {
  //   //     console.log("server is unlocked");
  //   //     serverLocked = false;
  //   //   } else {
  //   //     console.log("server is locked");
  //   //     serverLocked = true;
  //   //   }

  //   //   const { data, error } = await supabase
  //   //   .from("new_world_queue")
  //   //   .update({
  //   //     updated_at: new Date().toISOString().toLocaleString('en-US'),
  //   //     server_locked : serverLocked
  //   //   })
  //   //   .match({
  //   //     id: 1
  //   //   })
  //   //   console.log("Data added to supabase");
  //   //   console.log(serverLocked);


  //   return {
  //     statusCode: 200,
  //     body: JSON.stringify("hello")
  //   }


  //   } catch (error) {

  //   console.log(error);

  //   return {
  //       statusCode: 500,
  //       body: JSON.stringify({error: 'Failed'}),
  //   }
  // }   
// }