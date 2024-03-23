// access the div element that will contain the results
const imagesContainer = document.querySelector(".images-container");

// access the search form and search button
const searchForm = document.querySelector("#search-form");
const searchButton = document.querySelector("#tv-search-button");

// access the result container
const resultsContainer = document.querySelector(".results-container");
console.log(resultsContainer.childNodes);

// use the images container to add a click event listener to the container of dynamically created card
document.addEventListener("click", function (event) {
	event.preventDefault();
	if (event.target.classList.contains("btn-primary") && event.target.closest(".images-container")) {
		const parentCard = event.target.closest(".card-container");
		if (parentCard) {
			const frontCard = parentCard.querySelector(".front-card");
			const backCard = parentCard.querySelector(".back-card");

			if (frontCard.classList.contains("hidden")) {
				// Show front card, hide back card
				frontCard.classList.remove("hidden");
				backCard.classList.add("hidden");
			} else {
				// Hide front card, show back card
				frontCard.classList.add("hidden");
				backCard.classList.remove("hidden");
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

	// if search yields no results, let the user know
	if (imagesContainer.childNodes.length < 1) {
		imagesContainer.innerHTML = "No results found 😢";
	}

	// Scroll to the results section
	resultsContainer.scrollIntoView({ behavior: "smooth" });

	console.log("New cards created!");
	console.log(`HERE: ${imagesContainer.childNodes.length}`);
});

// function to create a new Bootstrap card component that displays all results
createNewCard = () => {
	// create a main container for the entire card
	const cardDivContainer = document.createElement("div");
	cardDivContainer.classList.add("card-container");

	const cardDiv = document.createElement("div");
	cardDiv.classList.add("card", "mb-3", "me-4");

	// call the function to create a formatted front card
	const newFrontCard = makeFrontCard();

	// call the function to create a formatted back card
	const newBackCard = makeBackCard();

	cardDiv.append(newFrontCard, newBackCard);
	cardDivContainer.append(cardDiv);

	return cardDivContainer;
};

const loadCard = (arrayOfObjects) => {
	console.log(`Objectsss: ${arrayOfObjects}`);
	for (let each of arrayOfObjects.data) {
		try {
			let customizeCard = createNewCard();
			customizeCard.querySelector(".card-img-top").src = `${each.show.image.medium}`;
			console.log(each.score);
			console.log(each.show.image.medium);

			// add a class to style the card with css
			customizeCard.classList.add("custom-card");

			// append the new card to the results images container
			imagesContainer.append(customizeCard);
		} catch (error) {
			console.log(`Each: ${each}`);
			let customizeCard = createNewCard();
			customizeCard.querySelector(".card-img-top").src =
				"https://t3.ftcdn.net/jpg/04/34/72/82/240_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg";

			// add a class to style the card with css
			customizeCard.classList.add("custom-card", "no-image-card");

			// make this image the same height as images from the API
			customizeCard.querySelector(".card-img-top").style.height = "424.234px";

			// append the new card to the results images container
			imagesContainer.append(customizeCard);

			console.log(`Failed to load image for ${each.show.name}: ${error}`);
		}
	}
};

// function responsible for creating the front side of the card with the elements
const makeFrontCard = () => {
	// create a div container for the front of the card
	const cardFront = document.createElement("div");
	cardFront.classList.add("front-card");

	// design the front of the card with an image
	const newImg = document.createElement("img");
	newImg.classList.add("card-img-top");
	newImg.src = "#";
	newImg.alt = "";

	// add a body to the front of the card
	const frontCardBody = document.createElement("div");
	frontCardBody.classList.add("card-body", "mx-auto");

	// add a "Show More" link to the card
	const newAnchor = document.createElement("a");
	newAnchor.href = "#";
	newAnchor.classList.add("btn", "btn-primary");
	newAnchor.textContent = "Show More";

	// add the show image and link to the front card's body
	frontCardBody.append(newImg);
	frontCardBody.append(newAnchor);

	cardFront.append(frontCardBody);

	return cardFront;
};

// function responsible for creating the back side of the card with detailed information
const makeBackCard = () => {
	// create a div container for the back of the card
	const cardBack = document.createElement("div");
	cardBack.classList.add("back-card", "hidden");
	// cardBack.style.height = "302px";
	cardBack.style.height = "449.281px";

	// design the back of card with a body of information
	const backCardBody = document.createElement("div");
	backCardBody.classList.add("card-body", "mx-auto");

	// create an h5 element to hold the show title
	const showTitle = document.createElement("h5");
	showTitle.innerText = "Temp Title";

	// create a paragraph element to hold the show summary
	const showSummary = document.createElement("p");
	showSummary.innerText = "Show summary...";

	// create a p element to hold the network name
	const networkName = document.createElement("p");
	networkName.innerText = "Name of network";

	// create a p element to hold the show type
	const showType = document.createElement("p");
	showTitle.innerText = "Type of Show:";

	// create a p element to hold the premier date
	const premierDate = document.createElement("p");
	premierDate.innerText = "Premier Date:";

	// create a link element to hold the url to the official show site
	const officialSite = document.createElement("a");
	officialSite.innerText = "Link to Site:";

	// add a "Show More" link to the card
	const newAnchor = document.createElement("a");
	newAnchor.href = "#";
	newAnchor.classList.add("btn", "btn-primary");
	newAnchor.textContent = "Show Less";

	// append all the elements to the back of the card
	backCardBody.append(
		showTitle,
		showSummary,
		networkName,
		showType,
		premierDate,
		officialSite,
		newAnchor
	);

	// append the body of the back card to the back-card container
	cardBack.append(backCardBody);

	return cardBack;
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
