$(function() {
    //https://api.themoviedb.org/3/movie/upcoming?api_key=<<api_key>>&language=en-US&page=1

    //apiKey = 4fbf839e8119eac90e6ac2cbbeabe382
    const $modalTitleEl = $('#modal-movie-title');
    const $modalPlotEl = $('#modal-movie-plot');
    const $modalYearEl = $('#modal-movie-year');

    let sUrl, myQuery, oData;
    myQuery = "";
    sUrl = 'https://api.themoviedb.org/3/movie/upcoming?api_key=4fbf839e8119eac90e6ac2cbbeabe382&language=en-US&page=1'
    $.ajax(sUrl, {
        complete: function(p_oXHR, p_sStatus){
            oData = $.parseJSON(p_oXHR.responseText).results; // Modify for dynamic search results
            if (oData === null) {
                console.log("failed");
            }
            else {
                appendImages(oData);
                addPosterTriggers();
            }
        }
    })

    function appendImages(oData) {
        for (let i = 0; i < oData.length; i++) {
            localStorage.setItem('mov' + oData[i].id, JSON.stringify(oData[i]));
            $(".soon-container").append(("<img id='mov"  + oData[i].id + "' class='js-modal-trigger column is-one-quarter box is-clipped' data-target='modal-js-poster' src='https://image.tmdb.org/t/p/w500" + oData[i].backdrop_path + "'/>"));
            console.log(oData[i].backdrop_path)
           }
    }
    
    function updateModal(event) {
        $modalTitleEl.html(JSON.parse(localStorage.getItem(event.target.id)).title);
        $modalPlotEl.html(JSON.parse(localStorage.getItem(event.target.id)).overview);
        $modalYearEl.html(JSON.parse(localStorage.getItem(event.target.id)).release_date);
    }

    function addPosterTriggers() {
        (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
            const modal = $trigger.dataset.target;
            const $target = document.getElementById(modal);
        
            $trigger.addEventListener('click', (event) => {
              updateModal(event);
              openModal($target);
            });
          });
    }

   
    // Functions to open and close a modal
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
    
});
