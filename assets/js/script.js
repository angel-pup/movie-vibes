$(function() { // start of jQuery function for on load best practice

    // for event handling and modifying elements on page
    let $movieFavEl = $("#movie-fav");
    let $dragBoxEl = $(".dragbox");
    let $searchMovieEl = $("#search-movie");
    let $searchResultsEl = $('#search-results-container');

    // for dynamic elements
    let favoriteListOrder = [];

    // sortable functionality
    $dragBoxEl.sortable({
        placeholder: "sortable-placeholder", // is this even being used?
        opacity: 0.5
    })

    function grabCurrentList() {
        let array = []
        let numOfEl = $dragBoxEl.children('li').length;
        for (let i = 0; i < numOfEl; i++) {
            array.push($dragBoxEl.children('li').eq(i).attr('mid'));
        }
        favoriteListOrder = array;
    }
    // for creating movie favorite list dynamically
    function updateFavorites() {
        //myMovies = favoriteListOrder; // modify to store favorites in local DB (when you click the save button)
    }

    // for adding movies to favorite list, calls updateFavorites function
    function addToFavorites(event) {
        event.preventDefault();
        favoriteListOrder.unshift(event.target.id);
        $movieFavEl.empty();
        favoriteListOrder.forEach((m) => {
            $movieFavEl.append("<li mid=\"" + event.target.id + "\" class=\"listitem\"><div class=\"text\">" + m
                + "<i class=\"fa fa-film\"></i></div></li>");
        });
    }

    $searchMovieEl.on('submit', function(p_oEvent){
        $searchResultsEl.empty();
        var sUrl, sMovie, oData;
        p_oEvent.preventDefault();
        sMovie = $searchMovieEl.find('input').val();
        console.log(sMovie);
        sUrl = 'https://www.omdbapi.com/?s=' + sMovie + '&type=movie&tomatoes=true&apikey=5e467eda'
        $.ajax(sUrl, {
            complete: function(p_oXHR, p_sStatus){
                oData = $.parseJSON(p_oXHR.responseText).Search; // Modify for dynamic search results
                console.log(oData);
                if (oData.Response === "False") {
                    $searchResultsEl.hide();
                } else {
                    oData.forEach((x) => {
                        $searchResultsEl.append("<div class=\"poster\"><img id=\'" + x.imdbID + "\' src=\'" + x.Poster + "\'/></div>")
                    });
                    /*<!--
                        <h3 class="title">Title</h3>
                        <p class="plot">Plot</p>
                        <span class="year">Year</span>
                    -->*/
                    $searchResultsEl.show();
                }
            }
        });
    });

    $searchResultsEl.on('click', '.poster img', addToFavorites); // update to point to button instead
    $dragBoxEl.on( "sortupdate", grabCurrentList);
    
}); // end of jQuery function for on load best practice