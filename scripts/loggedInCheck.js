// Redirects to login page if the user is not logged in.
window.onload = function() {
    if(!localStorage.getItem("accountID")){
        window.location.replace("../src/login.php"); // redirects to new page
    }
  };