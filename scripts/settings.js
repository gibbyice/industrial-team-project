function logout(){
    localStorage.removeItem("accountID")
    window.location.replace("../src/login.php"); // redirects to new page
}