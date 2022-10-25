let $movieFavEl = $("#movie-fav");
let myMovies = ["Movie 1", "Movie 2", "Movie 3", "Movie 4"];
let $searchEl = $("#searchBtn")

function updateFavorites() {
$movieFavEl.empty();
    myMovies.forEach((x) => {
        $movieFavEl.append("<li class=\"listitem\"><div class=\"text\"> " + x + " <i class=\"fa fa-film\"></i></div></li>");
    });
}

function addToFavorites(event) {
    event.preventDefault()
    let movie;
    movie = $(event.target).children("input").val()
    // console.log(movie)
    myMovies.push(movie)
    updateFavorites()
//grabEventData()

}

updateFavorites();

$searchEl.on('submit', addToFavorites)







