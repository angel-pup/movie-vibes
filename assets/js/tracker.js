$(function() { // start of jQuery function for on load - best practice

    // declarations for event handling and modifying elements on page
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
    // for dynamic elements/ local variables
    let favoriteMovieOrder = []; //will hold displayed favorite movie order.
    let currentMovieTarget; //current target when modal trigger got activated

    // sortable functionality
    $dragBoxEl.sortable({
        placeholder: "sortable-placeholder", // is this even being used?
        opacity: 0.5
    })

    /**
     * takes in an element and adds an is-active class; is utilized to open modals.
     * @param {*} $el modal element to be activated.
     */
    function openModal($el) {
        $el.classList.add('is-active');
    }

    /**
     * takes in an element and removes an is-active class; is utilized to close modals.
     * @param {*} $el modal element to be deactivated 
     */
    function closeModal($el) {
        $el.classList.remove('is-active');
    }

    /**
     * closes all modals by utilizing closeModal function
     */
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

    /**
     * grabs local storage data for current favorite order
     */
    function grabCurrentList() {
        if (localStorage.getItem('favoriteOrder') !== null) {
                favoriteMovieOrder = JSON.parse(localStorage.getItem('favoriteOrder'));
        }
    }

    /**
     * grabs the favorite list from the onscreen list and updates order in local storage
     * needed in case order is changed via sortable - attached to save-list button.
     */
    function updateListOrder() {
        const elements = $dragBoxEl.children('li');
        let order = [];
        for (let i = 0; i < elements.length; i++) {
            order.push(elements[i].attributes.mid.value);
        }
        localStorage.setItem('favoriteOrder', JSON.stringify(order));
    }

    /**
     * refreshes list based off of what's in local storage on page load.
     */
    function refreshFavorites() {
        grabCurrentList();
        $movieFavEl.empty();
        if (favoriteMovieOrder !== null) {
            favoriteMovieOrder.forEach((m) => {
                $movieFavEl.append("<li mid=\"" + m + "\" class=\"listitem\"><div class=\"text\">" + JSON.parse(localStorage.getItem(m)).Title
                    + "<i class=\"fa fa-film\"></i></div></li>");
            });
        }
    }

    /**
     *  for adding movies to favorite list, calls refresh
     */
    function addToFavorites() {
        grabCurrentList();
        favoriteMovieOrder.unshift(currentMovieTarget);
        localStorage.setItem('favoriteOrder', JSON.stringify(favoriteMovieOrder));
        refreshFavorites();
    }

    /**
     * updates modal with appropriate movie information
     * @param {Object} event for grabbing current movie id 
     */
    function updateModal(event) {
        currentMovieTarget = event.target.id;
        $modalTitleEl.html(JSON.parse(localStorage.getItem(currentMovieTarget)).Title);
        $modalPlotEl.html(JSON.parse(localStorage.getItem(currentMovieTarget)).Plot);
        $modalYearEl.html(JSON.parse(localStorage.getItem(currentMovieTarget)).Year);
    }

    /**
     * 
     * @param {*} p_oEvent 
     */
    function APIcall(p_oEvent) {
        let sUrl, sMovie, oData; 
        p_oEvent.preventDefault();
        sMovie = $searchMovieEl.find('input').val();
        sUrl = 'https://www.omdbapi.com/?s=' + sMovie + '&type=movie&tomatoes=true&apikey=5e467eda'
        $.ajax(sUrl, {
            complete: function(p_oXHR, p_sStatus){ //on completion grabs status codes. 
                oData = $.parseJSON(p_oXHR.responseText).Search; // Modify for dynamic search results
                if (oData.Response === "False") { //if false it will hide search results
                    $searchResultsEl.hide();
                } else {
                    (document.querySelectorAll('.js-modal-trigger') || [])
                        .forEach(($trigger) => {
                            $trigger.removeEventListener('click', (event)); });

                    $searchResultsEl.empty(); //whenever we get successful response it clears out results

                    oData.forEach((x) => {
                        // Dynamically show results of our API query
                        $searchResultsEl.append("<div class=\"poster is-one-quarter js-modal-trigger\"" +
                            " data-target=\"modal-js-poster\"><img alt=\'Movie Poster for...\' id=\'" +
                            x.imdbID + "\' src=\'" + x.Poster + "\'/></div>");

                        // Store new results in local storage to save on API calls
                        if (localStorage.getItem(x.imdbID) !== null) {
                            console.log("Local Storage contains result: " + x.imdbID);
                        } else {
                            let oData2;
                            sUrl = 'https://www.omdbapi.com/?i=' + x.imdbID + '&type=movie&apikey=5e467eda'
                            $.ajax(sUrl, {
                                complete: function(p_oXHR2, p_sStatus2){
                                    oData2 = $.parseJSON(p_oXHR2.responseText);
                                    if (oData2.Response === "False") {
                                        console.log("Failed to fetch additional details for " + x.imdbID);
                                    } else {
                                        localStorage.setItem(x.imdbID, JSON.stringify(oData2));
                                    }
                                }
                            })
                        }
                    });

                    /**
                     * adds an event listener to all poster elements
                     */
                    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
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
    
    /**
     * deletes all information from local storage
     * refreshes page
     */
    function deleteItems() {
        localStorage.clear();
        location.reload();
    }

    //event listeners
  
    /**
     * calls api function based on user text submission
     */
    $searchMovieEl.on('submit', APIcall);
    /**
     * calls api after button click
     */
    $actionButtonEl.on('click', APIcall);
    /**
     * allows user to click and drag favorite movie list
     */
    $dragBoxEl.on('sortupdate', grabCurrentList);
    /**
     * allows user to add movie to favorites list from modal
     */
    $modalButtonEl.on('click', addToFavorites);
    /**
     * saves favorite movies list until cleared from local storage
     */
    $saveListEl.on('click', updateListOrder);
    /**
     * clears local storage data
     */
    $deleteListEl.on('click', deleteItems);

    refreshFavorites();
}); // end of jQuery function for on load best practice