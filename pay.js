
$(document).ready(function () {

});

val = 250;

function recompute() {
    val = 150;
    if ($("input[name=tshirt]:checked").val() == "tshirt")
        val += 100;
    if ($("input[name=member]:checked").val() != "member")
        val += 50;
    $(".paybutton").html("Pay R" + val);
}

function pay() {
    $.get("/pay?reference=" + $("#reference")[0].value.replace(" ", "-") + "&value=" + val, function (r) {
        eval(JSON.parse(r)['form']);
    });
}