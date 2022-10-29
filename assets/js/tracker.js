$(function() { // start of jQuery function for on load best practice

    // for event handling and modifying elements on page
    let $movieFavEl = $("#movie-fav");
    let $dragBoxEl = $(".dragbox");
    let $searchMovieEl = $("#search-movie");
    let $actionButtonEl = $("#search-movie a");
    let $searchResultsEl = $('#search-results-container');
    let $modalBodEl = $('.modal-card-body');
    let $modalPlotEl = $('.modal-movie-plot');
    let $modalTitleEl = $('.modal-movie-title');
    let $modalYearEl = $('.modal-movie-year');
    let $modalButtonEl = $('.modal-movie-button');

    // for dynamic elements
    let favoriteListOrder = []; // Array of binary arrays
    let currentSearchedDetails = [];

    // sortable functionality
    $dragBoxEl.sortable({
        placeholder: "sortable-placeholder", // is this even being used?
        opacity: 0.5
    })

    function grabCurrentList() {
        let array = [];
        let numOfEl = $dragBoxEl.children('li').length;
        for (let i = 0; i < numOfEl; i++) {
            array.push($dragBoxEl.children('li').eq(i).attr('mid'), $dragBoxEl.children('li').eq(i).children()[0].textContent);
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
            $movieFavEl.append("<li mid=\"" + m[0] + "\" class=\"listitem\"><div class=\"text\">" + m[1]
                + "<i class=\"fa fa-film\"></i></div></li>");
        });
    }

    function updateModal(event) {
        $modalBodEl.empty();
        $modalBodEl.append("<h2>"+event.target.id+"</h2>");
        $modalTitleEl.innerHTML = event.target.plot;
    }

    $actionButtonEl.on('click', function(p_oEvent){
        let sUrl, sMovie, oData;
        p_oEvent.preventDefault();
        sMovie = $searchMovieEl.find('input').val();
        sUrl = 'https://www.omdbapi.com/?s=' + sMovie + '&type=movie&tomatoes=true&apikey=5e467eda'
        $.ajax(sUrl, {
            complete: function(p_oXHR, p_sStatus){
                oData = $.parseJSON(p_oXHR.responseText).Search; // Modify for dynamic search results
                if (oData.Response === "False") {
                    $searchResultsEl.hide();
                } else {

                    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => { $trigger.removeEventListener('click', (event)); });

                    $searchResultsEl.empty();

                    currentSearchedDetails = [];

                    oData.forEach((x) => {
                        /* //DISABLED FEATURE UNTIL WE FINALIZE BUILD
                        let oData2;
                        sUrl = 'https://www.omdbapi.com/?i=' + x.imdbID + '&type=movie&apikey=5e467eda'
                        $.ajax(sUrl, {
                            complete: function(p_oXHR2, p_sStatus2){
                                oData2 = $.parseJSON(p_oXHR2.responseText);
                                if (oData2.Response === "False") {

                                } else {
                                    currentSearchedDetails.push({ 'plot': oData2.Plot, 'title': oData2.Title, 'year': oData2.Year });
                                }

                            }
                        }) */
                        $searchResultsEl.append("<div class=\"poster is-one-quarter js-modal-trigger\" data-target=\"modal-js-poster\"><img alt=\'Movie Poster for...\' id=\'" + x.imdbID + "\' src=\'" + x.Poster + "\'/></div>")
                    });

                    console.log(currentSearchedDetails);

                    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
                        //const movieID = event.target.id;
                        const modal = $trigger.dataset.target;
                        const $target = document.getElementById(modal);

                        $trigger.addEventListener('click', (event) => {
                            updateModal(event);
                            openModal($target);
                        });
                    });

                    $searchResultsEl.show(); //last statement of else
                }
            }
        });
    });

    //$searchResultsEl.on('click', '.js-modal-trigger', addToFavorites); // update to point to button instead
    $dragBoxEl.on('sortupdate', grabCurrentList);
    $modalButtonEl.on('click', addToFavorites);

    function openModal($el) {
        $el.classList.add('is-active');
    }

    function closeModal($el) {
        $el.classList.remove('is-active');
    }

    function closeAllModals() {
        (document.querySelectorAll('.modal') || []).forEach(($modal) => {
            closeModal($modal);
        });
    }

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
            closeModal($target);
        });
    });

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
        const e = event || window.event;

        if (e.keyCode === 27) { // Escape key
            closeAllModals();
        }
    });
}); // end of jQuery function for on load best practice