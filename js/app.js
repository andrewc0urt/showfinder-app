// access the div element that will contain the results (front = imagesContainer, back = infoContainer)
const imagesContainer = document.querySelector(".images-container");

// access the search form and search button
const searchForm = document.querySelector("#search-form");
const searchButton = document.querySelector("#tv-search-button");

// access the result container
const resultsContainer = document.querySelector(".results-container");
console.log(resultsContainer.childNodes);

// event listener for the "show more" button on a card to flip the card from front-to-back and back-to-front
document.addEventListener("click", function (event) {
	// get the element clicked to see if it's a button or link to external site
	const clickedElement = event.target;

	// Check if the clicked element is a button
	if (clickedElement.classList.contains("btn")) {
		event.preventDefault();
	}

	const showMoreButton = event.target.closest(".more-button");
	if (showMoreButton && showMoreButton.classList.contains("more-button")) {
		// Find the closest card container
		const cardContainer = showMoreButton.closest(".card-container");

		// when a user clicks the "Show More" button, scroll to the top of that card so user doesn't have to
		cardContainer.scrollIntoView({ behavior: "smooth", block: "start" });

		if (cardContainer) {
			// Find the front and back cards within the same card container
			const frontCard = cardContainer.querySelector(".front-card");
			const backCard = cardContainer.querySelector(".back-card");
			if (frontCard && backCard) {
				// Toggle the visibility of front and back cards
				frontCard.classList.toggle("hidden");
				backCard.classList.toggle("hidden");
			}
		}
	}
});

// TVMaze API Url
const tvMazeURL = "https://api.tvmaze.com/search/shows";

// event listener for when search button is clicked by the user
searchButton.addEventListener("click", async (e) => {
	e.preventDefault();
	const userSearch = searchForm.elements.tvSearch.value;
	console.log(userSearch);

	// clear the form
	searchForm.elements.tvSearch.value = "";

	// prevent duplicate Result headers from displaying
	if (resultsContainer.firstChild) {
		resultsContainer.firstChild.remove();
	}

	// ensure the results field is cleared
	clearResults();

	// set the search parameters
	const config = {
		params: { q: userSearch },
	};

	// variable to store the response returned from the API
	const apiResponse = await axios.get(tvMazeURL, config);

	// display the return objects in the console for testing purposes
	console.log(apiResponse);
	console.log("----------");
	console.log(apiResponse.data);

	// display the Results header
	resultsHeader();

	// display the results as cards
	loadCard(apiResponse);

	// Scroll to the area of the page where results are shown after a short delay
	// this fixes the issue of not correctly scrolling into view right away
	setTimeout(() => {
		resultsContainer.scrollIntoView({ behavior: "smooth" });
	}, 100);

	// if search yields no results, let the user know
	if (imagesContainer.childNodes.length < 1) {
		imagesContainer.innerHTML = "No results found 😢";
	}

	// Console.log messages to show new cards have been created and the images-container results length (total results)
	// console.log("New cards created!");
	console.log(`HERE: ${imagesContainer.childNodes.length}`);
});

// function to create a new Bootstrap card component that displays all results
const createNewCard = () => {
	// create an object to hold the front card and the back card
	const newCardObject = {
		// call the functions that create the front and back cards and store them in separate variables
		frontCard: makeFrontCard(),
		backCard: makeBackCard(),
	};
	return newCardObject;
};

// function to create the content for the front card which will store the image and a 'Show More' button
const makeFrontCard = () => {
	const frontCard = document.createElement("div");
	frontCard.classList.add("card", "mb-3", "me-md-4", "me-0", "front-card");

	const newImg = document.createElement("img");
	newImg.classList.add("card-img-top");
	newImg.src = "#";
	newImg.alt = "";

	const frontCardBody = document.createElement("div");
	frontCardBody.classList.add("card-body", "mx-auto");

	const newAnchor = document.createElement("a");
	newAnchor.href = "#";
	newAnchor.classList.add("btn", "more-button");
	newAnchor.textContent = "See More";

	// create the card by appending the new elements
	frontCard.append(newImg);

	frontCardBody.append(newAnchor);

	frontCard.append(frontCardBody);

	return frontCard;
};

// function responsible for creating the back side of the card with detailed information
const makeBackCard = () => {
	// create a div container for the back of the card
	const backCard = document.createElement("div");
	backCard.classList.add("card", "mb-3", "me-md-4", "me-0", "back-card");
	// backCard.style.height = "302px";
	// backCard.style.height = "449.281px";

	// design the back of card with a body of information
	const backCardBody = document.createElement("div");
	backCardBody.classList.add("card-body", "mx-auto");

	// create a flex container to hold the show title and link to offical website
	const titleAndSiteContainer = document.createElement("div");
	titleAndSiteContainer.classList.add("d-flex", "justify-content-between", "mb-2");

	// create an h5 element to hold the show title
	const showTitle = document.createElement("h5");
	showTitle.classList.add("show-title", "fw-bold");
	// showTitle.innerText = "Show Title: ";

	// create a paragraph element to hold the show summary
	const showSummary = document.createElement("p");
	showSummary.classList.add("show-summary");

	// create a p element to hold the network name
	const networkName = document.createElement("p");
	networkName.classList.add("network-name");

	// create a p element to hold the show type
	const showType = document.createElement("p");
	showType.classList.add("show-type");

	// create a p element to hold the premier date
	const premierDate = document.createElement("p");
	premierDate.classList.add("premier-date");

	// create a link element to hold the url to the official show site
	const officialSite = document.createElement("a");
	officialSite.classList.add("site-link");

	titleAndSiteContainer.append(showTitle, officialSite);

	// add a "Show More" button to the card

	// div to serve as a container for the "Show Less" button, make it a flex-container using d-flex as a class
	// add bootstrap classes to center the element and add a margin top and bottom
	const showLessButtonContainer = document.createElement("div");
	showLessButtonContainer.classList.add(
		"button-container",
		"d-flex",
		"justify-content-center",
		"mt-3"
	);

	const newAnchor = document.createElement("a");
	newAnchor.href = "#";
	newAnchor.classList.add("btn", "more-button");
	newAnchor.textContent = "Show Less";

	showLessButtonContainer.append(newAnchor);

	// append all the elements to the back of the card
	backCardBody.append(
		titleAndSiteContainer,
		showSummary,
		networkName,
		showType,
		premierDate,
		showLessButtonContainer
	);

	// append the body of the back card to the back-card container
	backCard.append(backCardBody);

	return backCard;
};

const loadCard = (arrayOfObjects) => {
	const defaultValue = "Not Available 🫣";
	// iterate through each object in the array and create a new card for each
	for (let each of arrayOfObjects.data) {
		try {
			// assign the object returned by createNewCard to a variable called customizeCard

			// create an object to iterate through to confirm it has a value
			const resultObjectData = {
				imgSrc:
					`${each.show.image.medium}` ||
					"https://t3.ftcdn.net/jpg/04/34/72/82/240_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg",
				showName: each.show.name || defaultValue,
				showSummary: each.show.summary || defaultValue,
				network: each.show.network?.name || defaultValue,
				type: each.show.type || defaultValue,
				premierDate: each.show.premiered || defaultValue,
				site: each.show.officialSite || defaultValue,
			};

			// get all the data for the front of the card
			let customizeCard = createNewCard();
			customizeCard.frontCard.querySelector(".card-img-top").src = `${resultObjectData.imgSrc}`;

			// add a class to style the card with css
			customizeCard.frontCard.classList.add("custom-card");

			// add all the data onto the card in the appropriate element

			customizeCard.backCard.querySelector(".show-title").innerText = resultObjectData.showName;
			customizeCard.backCard.querySelector(
				".site-link"
			).innerHTML = `<a href="${resultObjectData.site}" target="_blank">Official Site</a>`;
			customizeCard.backCard.querySelector(".show-summary").innerHTML =
				resultObjectData.showSummary;
			customizeCard.backCard.querySelector(
				".network-name"
			).innerHTML = `<span class="fw-medium">Network</span>: ${resultObjectData.network}`;
			customizeCard.backCard.querySelector(
				".show-type"
			).innerHTML = `<span class="fw-medium">Show Type:</span> ${resultObjectData.type}`;
			customizeCard.backCard.querySelector(
				".premier-date"
			).innerHTML = `<span class="fw-medium">Premiered:</span> ${resultObjectData.premierDate}`;

			// Append the back card to the front card and hide the back card initially
			// customizeCard.frontCard.appendChild(customizeCard.backCard);
			customizeCard.backCard.classList.add("hidden");

			// create a card container to hold both the front and back cards
			const cardContainer = document.createElement("div");
			cardContainer.classList.add("card-container");

			cardContainer.append(customizeCard.frontCard, customizeCard.backCard);

			imagesContainer.append(cardContainer);
		} catch (error) {
			console.log(`Error here: ${each}`);
			console.log(error);
		}
	}
};

const resultsHeader = () => {
	const div = document.createElement("div");
	div.classList.add("h4", "pb-2", "mb-3", "text-danger", "results-header");
	div.innerText = "Results:";
	div.style.width = "82.5%";

	// make the new div the first child of resultsContainer
	resultsContainer.prepend(div);
};

// function to clear the results section of the page
const clearResults = () => {
	// remove all previous tv show results
	while (imagesContainer.firstChild) {
		console.log(`Current Child: ${imagesContainer.firstChild}`);
		imagesContainer.removeChild(imagesContainer.firstChild);
	}

	console.log("Page cleared!");
};
