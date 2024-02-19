const fs = require("fs");
let dublicateEvents = 0;

async function getAllEvents() {
	const pastEventsSet = new Set();
	const allEvents = [];

	let currentPage = 1;
	let totalPages = Infinity;

	while (currentPage <= totalPages) {
		console.log("Sending request for page: ", currentPage);
		const response = await fetch(
			`http://localhost:32000/api/getAllEventsMasterCamps?page=${currentPage}`
		);
		const responseData = await response.json();

		if (!responseData.IsSuccess) {
			console.error("Error fetching events:", responseData.Message);
			return;
		}

		const { pastEvent, totalPages: total, page } = responseData.Data;

		totalPages = total;
		console.log("[RES] totalPages: ", total, " on page: ", currentPage);

		// Check for duplicate events
		pastEvent.forEach((event) => {
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

// Usage
getAllEvents()
	.then((allEvents) => {
		console.log("Total Events: ", allEvents.length);
		console.log("Dublicate Events: ", dublicateEvents);
		fs.writeFileSync(
			"./json/mastercamp_API_Tester.json",
			JSON.stringify(allEvents)
		);
	})
	.catch((error) => {
		console.error("Error:", error);
	});
