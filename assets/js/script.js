let $movieFavEl = $("#movie-fav");
let myMovies = ["Movie 1", "Movie 2", "Movie 3", "Movie 4"];


function updateFavorites() {

    myMovies.forEach((x) => {
        $movieFavEl.append("<li class=\"listitem\"><div class=\"text\"> " + x + " <i class=\"fa fa-film\"></i></div></li>");
    });
}

function addToFavorites(event) {
    event.preventDefault()
    let movie;
    movie = event.target.innerHTML
    console.log(movie)
//grabEventData()

}

updateFavorites();

// document.getElementByIdaddEventListener 







