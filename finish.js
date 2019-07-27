$(document).ready(function(){
    $.ajax("/finish_check" + location.search).done(function (res) {
        console.log(res);
        res = JSON.parse(res);
        if (res.success === true) {
            $("h1").html("Success!");
        } else {
            $("h1").html("Error: " + res.error);
        }
    });
 });