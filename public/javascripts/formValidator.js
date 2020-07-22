function validateForm() {
    var x = document.forms["myForm"]["username"].value;
    if (x == "") {
        alert("Username must be filled out");
        return false;
    }

    var x = document.forms["myForm"]["password"].value;
    if (x == "") {
        alert("Password must be filled out");
        return false;
    }
}