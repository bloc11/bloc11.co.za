
$(document).ready(function () {

});

$(document).mousedown(function () {
    $("#error").html("&nbsp;");
})

$(document).keydown(function () {
    $("#error").html("&nbsp;");
})

function pay() {
    $("#error").html("");
    var selected = $("input[name=price]:checked");
    if (selected.length == 0) {
        $("#error").html("No price selected!");
        return;
    }
    var reference, value;
    if (selected[0].value == "custom") {
        if ($("#custom-value")[0].value == "") {
            $("#error").html("please provide custom value");
            return;
        }
        if (!$("#custom-value")[0].value.match(/[0-9]+/)) {
            $("#error").html("please provide numeric value for custom");
            return;
        }
        value = $("#custom-value")[0].value;

    } else {
        value = selected[0].value;
    }
    reference = $("#reference")[0].value.replace(" ", "-");
    $.get("/donate?reference=" + reference + "&price=" + value, function (r) {
        eval(JSON.parse(r)['form']);
    });
}