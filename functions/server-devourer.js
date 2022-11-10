const { supabase } = require("../utils/database");
const dotenv = require("dotenv").config();


exports.handler = async (event, context) => {

  try {

    const { data, error } = await supabase
      .from('new_world_queue')
      .select()

    const serverData = data[0].server_json.data.servers;

    let serverDevourer;
    let serverLocked = false;
    for(let server of serverData) {
      if(server[4] === "Devourer")
      serverDevourer = server;
        if(server[7] === 1304) {
          serverLocked = true;
        }
    }
    console.log(serverLocked);

    const { data: devourerData, error: err2 } = await supabase
    .from("new_world_queue")
    .update({
      updated_at: new Date().toISOString().toLocaleString('en-US'),
      devourer_locked : serverLocked
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

    
  

  } catch (err2) {
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({
        error: err.message
      })
    }
  }
}