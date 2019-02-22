
$(document).ready(function () {

});

function pay() {
    $.get("/pay?reference=" + $("#reference")[0].value.replace(" ", "-"), function (r) {
        eval(JSON.parse(r)['form']);
    });
}