/**
 * get the value of the input field
 * call `fetchResults` and pass it the `searchQuery`
 * @param event
 */
const endpoint = `http://www.omdbapi.com/?apikey=aba065d3`;
function handleSubmit(event) {
    // prevent page from reloading when form is submitted
    event.preventDefault();
    const input = document.querySelector(".searchForm-input").value;
    // remove whitespace from the input
    const searchQuery = input.trim();
    fetchResults(searchQuery);
}

function fetchResults(searchQuery) {
    fetch(endpoint+`&s=${searchQuery}`)
        .then(response => response.json())
        .then(data => {
            const results = data.Search;
            displayResults(results, searchQuery);
        })
        .catch(function(error) {
            console.log(error);
        });
}

function fetchByimdbID(id) {
    fetch(endpoint+`&i=${id}`)
        .then(response => response.json())
        .then(data => {
            const movie = data;
            let span = document.createElement("span");
            let rating = movie.Ratings.length > 0 ? movie.Ratings[0].Value : 'N/A';
            span.setAttribute("class", "tooltiptext");
            // console.log(this);
            span.innerHTML = `<ul><li>${movie.Title}</li>
                                  <li>${movie.Year}</li>
                                  <li>${movie.Director}</li>
                                  <li>${rating}</li></ul>`;
            this.parentNode.insertBefore(span, this); //this is img . before i referred to previous sibling which is none
        }).catch(function(error) {
            console.log(error);
        });
}

/**
 * calls fetchByimdbID to fetch the details of
 * single movie record
 * @param id (imdbID)
 */
function addToolTip(id) {
    fetchByimdbID.call(this, id);
}

function removeToolTip(e) {
    if (this.previousSibling) {
        this.previousSibling.remove()
    }
}

function handler(fn, id) {

    return function (e) {
        if (e.target.tagName !== 'IMG') return;

         fn.call(e.target, id);
    };
}

// function addTip (e) {
//     if(e.target !== e.currentTarget) {
//         fetchByimdbID.call(e.target, e.target.id);
//     }
// }
//
// function removeTip(e) {
//     if(e.target !== e.currentTarget) {
//         if (e.target.childNodes.length > 0) {
//             let childNodes = e.target.childNodes;
//             childNodes.forEach(function (node) {
//                 if(node.tagName === 'SPAN') {
//                     e.target.removeChild(node);
//                 }
//             })
//         }
//     }
// }

/**
 * Loop over movieResults & construct the HTML & display on the page
 * Also checks if each movie has a poster or not. If no poster avialble it
 * reads "NoImage" file from local
 * @param results
 */
function displayResults(movies, query) {
    // Store a reference to `.searchResults`
    const searchResults = document.querySelector(".searchResults");
    let poster;
    // Remove all child elements
    searchResults.innerHTML = ``;
    // Loop over results array
    if (movies) {
        movies.forEach(result => {
            if (result.Poster === 'N/A') {
                poster = "No_Image.jpg";
            } else {
                poster = result.Poster;
            }
            searchResults.insertAdjacentHTML("beforeend",
                `<figure class="gallery__item tooltip">
                    <img  class="img" src="${poster}" id="${result.imdbID}">
                    <figcaption class="gallery__image-caption">
                        ${result.Title}<br>${result.Type}
                    </figcaption>
                </figure>`
            );
        });
        // let elem = document.getElementsByClassName("gallery");
        // elem[0].addEventListener("mouseover", addTip, false);
        // elem[0].addEventListener("mouseout", removeTip, false);

        let elements = document.getElementsByClassName("img");
        _.forEach(elements, (ele) => {
            ele.addEventListener("mouseover", handler(addToolTip, ele.id));
            ele.addEventListener("mouseout", handler(removeToolTip));
        })
    } else {
        searchResults.innerHTML = `<h1>No Results Found : ${query}</h1>`;
    }
}

const form = document.querySelector(".searchForm");
form.addEventListener("input", handleSubmit);
form.addEventListener("submit", handleSubmit);
