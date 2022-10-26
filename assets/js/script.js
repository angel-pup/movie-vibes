$(function() { // start of jQuery function for on load best practice

    // for event handling and modifying elements on page
    let $movieFavEl = $("#movie-fav");
    let $dragBoxEl = $(".dragbox");
    let $searchMovieEl = $("#search-movie");
    let $searchResultsEl = $('#search-results-container');

    // for dynamic elements
    let myMovies = ["Movie 1", "Movie 2", "Movie 3", "Movie 4"];

    // sortable functionality
    $dragBoxEl.sortable({
        stop: (event, ui) => updateArray(event, ui)
    })

    // for updating movie array
    function updateArray(event, ui) {
        console.log(ui);
        console.log(event);
    }

    // for creating movie favorite list dynamically
    function updateFavorites() {
    $movieFavEl.empty();
        myMovies.forEach((x) => {
            $movieFavEl.append("<li class=\"listitem\"><div class=\"text\"> " + x + " <i class=\"fa fa-film\"></i></div></li>");
        });
    }

    // for adding movies to favorite list, calls updateFavorites function
    function addToFavorites(event) {
        event.preventDefault()
        let movie;
        movie = $(event.target).children("input").val()
        // console.log(movie)
        myMovies.unshift(movie)
        updateFavorites()
        //grabEventData()
    }

    // dumb (smart?) ajax stuff
    $searchResultsEl.hide();
    $searchMovieEl.on('submit', function(p_oEvent){
        var sUrl, sMovie, oData;
        p_oEvent.preventDefault();
        sMovie = $searchMovieEl.find('input').val();
        console.log(sMovie);
        sUrl = 'https://www.omdbapi.com/?s=' + sMovie + '&type=movie&tomatoes=true&apikey=5e467eda'
        $.ajax(sUrl, {
            complete: function(p_oXHR, p_sStatus){
                oData = $.parseJSON(p_oXHR.responseText).Search[0]; // Modify for dynamic search results
                console.log(oData);

                if (oData.Response === "False") {
                    $searchResultsEl.hide();
                } else {
                    $searchResultsEl.find('.title').text(oData.Title);
                    $searchResultsEl.find('.plot').text(oData.Plot);
                    $searchResultsEl.find('.poster').html('<img src="' + oData.Poster + '"/>');
                    $searchResultsEl.find('.year').text(oData.Year);
                    $searchResultsEl.show();
                }
            }
        });
    });

}); // end of jQuery function for on load best practice






