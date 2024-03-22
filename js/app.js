// access the div element that will contain the results
const imagesContainer = document.querySelector(".images-container");

// access the search form and search button
const searchForm = document.querySelector("#search-form");
const searchButton = document.querySelector("#tv-search-button");

// access the result container
const resultsContainer = document.querySelector(".results-container");
console.log(resultsContainer.childNodes);

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
	const newDiv = document.createElement("div");
	newDiv.classList.add("card", "mb-3", "me-4");

	const newImg = document.createElement("img");
	newImg.classList.add("card-img-top");
	newImg.src = "#";
	newImg.alt = "";

	const newDiv2 = document.createElement("div");
	newDiv2.classList.add("card-body", "mx-auto");

	const newAnchor = document.createElement("a");
	newAnchor.href = "#";
	newAnchor.classList.add("btn", "btn-primary");
	newAnchor.textContent = "See More";

	// create the card by appending the new elements
	newDiv.append(newImg);

	newDiv2.append(newAnchor);

	newDiv.append(newDiv2);

	return newDiv;
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
