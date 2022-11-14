const { supabase } = require("../utils/database");
const fetch = require('node-fetch');
const dotenv = require("dotenv").config();



exports.handler = async (event, context) => {

  const { data: discord_data, error: discord_error } = await supabase
  .from('discord_webhooks')
  .select()
  const discordData = discord_data;

  const { data: queue_data, error: queue_error } = await supabase
  .from('new_world_queue')
  .select()

  const queueData = queue_data[0];

  // const lastStatus =  queue_data[0].devourer_locked;


//Handle notify logic
 if(queueData.devourer_locked && !queueData.send_ping) {
  await supabase
  .from('new_world_queue')
  .update({ send_ping: true })
  .eq('id', 1)
 }
//  if(!queueData.devourer_locked) {
//   await supabase
//   .from('new_world_queue')
//   .update({ send_ping: true })
//   .eq('id', 1)
//  }

 // Ping once
 if(queueData.send_ping) {
  await supabase
  .from('new_world_queue')
  .update({ dont_ping: true })
  .eq('id', 1)
 }


// Handle queue color - default green, greater than 1 orange, more than 999 red
let embedColor;
let date = new Date(queueData.updated_at);
date = date.toLocaleString("en-US", {timeZone: "America/New_York"});

console.log(date);

if(queueData.devourer_locked) {
  embedColor = 16711680;
} else {
  embedColor = 2021216
}

  

//POST to any URLs in db
  const requests = discordData.map(url => {   
     

    const discordRoleId = `<@&${url.role_id}>`

    const config = {
      method: 'POST',
      body: JSON.stringify({
        "content": `${!queueData.dont_ping ? discordRoleId : ""}`,
      username: `Devourer Status: ${queueData.devourer_locked ? "Locked" : "Unlocked"}`,
      embeds: [{
        "color": `${embedColor}`,
        "title": `Devourer is currently: ${queueData.devourer_locked ? ":lock: Locked" : ":unlock: Unlocked"}`,
        "footer": {
          "text": `As of ${date} EST \nTo add this to your server add Kidron#8857 on discord`
        }
      }]
      }), 
      headers: { 'Content-Type': 'application/json' }
  }

    fetch(url.discord_url, config)
  });
  const responses = await Promise.all(requests);
  const promises = responses.map(response => response.text());
  const fetchData = await Promise.all(promises);
    
  //Need to add error handling

  return {
    statusCode: 200,
    body: JSON.stringify({ 
      fetchData
    }),
  };
 
}