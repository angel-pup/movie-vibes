$(function() {
    //https://api.themoviedb.org/3/movie/upcoming?api_key=<<api_key>>&language=en-US&page=1

    //apiKey = 4fbf839e8119eac90e6ac2cbbeabe382
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
                console.log(oData);
                appendImages(oData);
            }
        }
    })

    function appendImages(oData) {
        for (let i = 0; i < oData.length; i++) {

            $(".soon-container").append(("<img src='https://image.tmdb.org/t/p/w500" + oData[i].backdrop_path + "'/>"));
            console.log(oData[i].backdrop_path)
           }
    }

});
