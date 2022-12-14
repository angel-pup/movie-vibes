$(function() { // start of jQuery function for on load - best practice

    // for event handling and modifying elements on page
    const $movieFavEl = $("#movie-fav");
    const $dragBoxEl = $(".dragbox");
    const $searchMovieEl = $("#search-movie");
    const $actionButtonEl = $("#search-movie a");
    const $searchResultsEl = $('#search-results');
    const $modalPlotEl = $('#modal-movie-plot');
    const $modalTitleEl = $('#modal-movie-title');
    const $modalYearEl = $('#modal-movie-year');
    const $modalButtonEl = $('#modal-movie-button');
    const $saveListEl = $('#save-list');
    const $deleteListEl = $('#clear-list');
    
    // for dynamic elements
    let favoriteMovieOrder = [];
    let currentMovieTarget;

    // sortable functionality
    $dragBoxEl.sortable({
        placeholder: "sortable-placeholder", // is this even being used?
        opacity: 0.5
    })

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

    function grabCurrentList() {
        if (localStorage.getItem('favoriteOrder') !== null) {
                favoriteMovieOrder = JSON.parse(localStorage.getItem('favoriteOrder'));
        }
    }

    function updateListOrder() {
        const elements = $dragBoxEl.children('li');
        let order = [];
        for (let i = 0; i < elements.length; i++) {
            order.push(elements[i].attributes.mid.value);
        }
        localStorage.setItem('favoriteOrder', JSON.stringify(order));
    }

    // for creating movie favorite list dynamically
    function refreshFavorites() {
        grabCurrentList();
        $movieFavEl.empty();
        if (favoriteMovieOrder !== null) {
            favoriteMovieOrder.forEach((m) => {
                updateLocalStorage(m);
                $movieFavEl.append("<li mid=\"" + m + "\" class=\"listitem\"><div class=\"text box\">" + JSON.parse(localStorage.getItem(m)).Title
                    + " <i class=\"fa fa-film\"></i></div></li>");
            });
        }
    }

    // for adding movies to favorite list, calls refresh
    //Favorites function
    function addToFavorites() {
        grabCurrentList();
        favoriteMovieOrder.unshift(currentMovieTarget);
        localStorage.setItem('favoriteOrder', JSON.stringify(favoriteMovieOrder));
        refreshFavorites();
    }

    function updateModal(event) {
        currentMovieTarget = event.target.id;
        updateLocalStorage(currentMovieTarget);
        let currentMovieInfo = JSON.parse(localStorage.getItem(currentMovieTarget));
        $modalTitleEl.html(currentMovieInfo.Title);
        $modalPlotEl.html(currentMovieInfo.Plot);
        $modalYearEl.html(currentMovieInfo.Year);
    }

    /**
     * Check if movie is in local storage, if not add to local storage
     * Saves on API calls
     * @param movieID id of movie
     */
    function updateLocalStorage(movieID) {
        if (localStorage.getItem(movieID) !== null) {
            // Do nothing
        } else {
            let oData2;
            let sUrl = 'https://www.omdbapi.com/?i=' + movieID + '&type=movie&apikey=5e467eda'
            $.ajax(sUrl, {
                complete: function (p_oXHR2, p_sStatus2) {
                    oData2 = $.parseJSON(p_oXHR2.responseText);
                    if (oData2.Response === "False") {
                        console.log("Failed to fetch additional details for " + x.imdbID);
                    } else {
                        localStorage.setItem(movieID, JSON.stringify(oData2));
                    }
                }
            })
        }
    }

    function APIcall(p_oEvent) {
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
                    $searchResultsEl.empty();

                    oData.forEach((x) => {
                        // Dynamically show results of our API query
                        $searchResultsEl.append("<div class=\"is-one-quarter js-modal-trigger box\"" +
                            " data-target=\"modal-js-poster\"><img alt=\'Movie Poster for " + x.Title + "\' id=\'" +
                            x.imdbID + "\' src=\'" + x.Poster + "\'/></div>");

                        updateLocalStorage(x.imdbID);
                    });

                    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
                        //const movieID = event.target.id;
                        const modal = $trigger.dataset.target;
                        const $target = document.getElementById(modal);

                        $trigger.addEventListener('click', (event) => {
                            updateModal(event); // my addition
                            openModal($target);
                        });
                    });

                    $searchResultsEl.show(); //last statement of else
                }
            }
        });
    }
    
    function deleteItems() {
        localStorage.clear();
        location.reload();
    }

    $searchMovieEl.on('submit', APIcall);
    $actionButtonEl.on('click', APIcall);
    $dragBoxEl.on('sortupdate', grabCurrentList);
    $modalButtonEl.on('click', addToFavorites);
    $saveListEl.on('click', updateListOrder);
    $deleteListEl.on('click', deleteItems);

    refreshFavorites();
}); // end of jQuery function for on load best practice