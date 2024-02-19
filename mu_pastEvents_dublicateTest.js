const fs = require("fs");
let dublicateEvents = 0;
const baseURL = require("./environment/environment").baseURL;

async function getPastEvents() {
	console.log("Environment", baseURL);

	const pastEventSet = new Set();
	const allEvents = [];

	let currentPage = 1;
	let totalPages = Infinity;

	while (currentPage <= totalPages) {
		console.log("Sending request for page: ", currentPage);
		const response = await fetch(
			`${baseURL}/api/getPastEventsMastersunion?page=${currentPage}`
		);
		const responseData = await response.json();

		if (!responseData.IsSuccess) {
			console.error("Error fetching events:", responseData.Message);
			return;
		}

		const {
			pastEvents,
			totalPages: total,
			currentPage: page
		} = responseData.Data;

		totalPages = total;
		console.log("[RES] totalPages: ", total, " on page: ", currentPage);

		// Check for duplicate events
		pastEvents.forEach((event) => {
			if (pastEventSet.has(event._id)) {
				console.log("Duplicate event found:", event._id);
				dublicateEvents++;
			} else {
				pastEventSet.add(event._id);
				allEvents.push(event);
			}
		});

		currentPage++;
	}

	return allEvents;
}

// Usage
getPastEvents()
	.then((allEvents) => {
		console.log("Total Events: ", allEvents.length);
		console.log("Dublicate Events: ", dublicateEvents);
		fs.writeFileSync("./json/mupastevents.json", JSON.stringify(allEvents));
	})
	.catch((error) => {
		console.error("Error:", error);
	});
