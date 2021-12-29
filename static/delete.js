function myFunction() {

    var result = confirm("Are you sure that you want to delete your account?\nThis action can not be undone!");
    if (result) {
        fetch("/settings/delete", {
            method: "delete",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(() => window.open("/logout", '_parent'))
    }
}

document.getElementById("delete").addEventListener("click", myFunction);

