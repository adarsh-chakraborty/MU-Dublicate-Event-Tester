const fs = require("fs");
let dublicateEvents = 0;

async function getAllEvents(url) {
    const pastEventsSet = new Set();
    const allEvents = [];
  
    let currentPage = 1;
    let totalPages = Infinity; 
   
  
    while (currentPage <= totalPages) {
        console.log("Sending request for page: ", currentPage);
      const response = await fetch(`${url}?page=${currentPage}`);
      const responseData = await response.json();
  
      if (!responseData.IsSuccess) {
        console.error("Error fetching events:", responseData.Message);
        return;
      }
  
      const { pastEvent, totalPages: total, page } = responseData.Data;
  
      totalPages = total;
      console.log("[RES] totalPages: ", total, " on page: ", currentPage);
  
      // Check for duplicate events
      pastEvent.forEach(event => {
        if (pastEventsSet.has(event._id)) {
          console.log("Duplicate event found:", event._id);
          dublicateEvents++;
        } else {
          pastEventsSet.add(event._id);
          allEvents.push(event);
        }
      });
  
      currentPage++;
    }
  
    return allEvents;
  }
  

  

    async function test(){
        const eventsFromLocalServer = await getAllEvents("http://localhost:32000/api/getAllEventsMasterCamps");
        console.log("Local server stats:");
        console.log("Total Events: ", eventsFromLocalServer.length);
        console.log("Dublicate Events: ", dublicateEvents);

        dublicateEvents = 0;

        const eventsFromAPI = await getAllEvents("https://api.mastersunion.org/api/getAllEventsMasterCamps");
        console.log("Server server stats:");
        console.log("Total Events: ", eventsFromAPI.length);
        console.log("Dublicate Events: ", dublicateEvents);

        let areEqual = true;

        if(eventsFromLocalServer.length === eventsFromAPI.length){
            console.log("Both have same events");
        }else{
            console.log("error unequal length");
        }


        for (let i = 0; i < eventsFromLocalServer.length; i++) {
            if (eventsFromLocalServer[i]._id !== eventsFromAPI[i]._id) {
                console.log(`At ${i} | ${eventsFromLocalServer[i]._id}`)
                areEqual = false;
                
            }
        }
    
        if (areEqual) {
            console.log("Events at corresponding indices are the same.");
        } else {
            console.log("Events at corresponding indices are different.");
        }
    }


    test()