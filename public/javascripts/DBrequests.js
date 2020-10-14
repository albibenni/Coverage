
class DBrequest{
  constructor(){}

  getData(xhttp) {
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // document.getElementById("demo").innerHTML = this.responseText;
      console.log(this.responseText);
    } 
  };
  xhttp.open("GET", "/get-data", true);
  xhttp.send();
  
  }
  postReqInsert(item) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/insert", true);
    xhttp.send(JSON.stringify(item));
  }
  //change
  postReqDelete(xhttp) {
    xhttp.onreadystatechange = () => {
      if (this.readyState == 4 && this.status == 200) {
        // document.getElementById("demo").innerHTML = this.responseText;
        console.log(this.responseText);
      }
    };
    xhttp.open("POST", "/delete", true);
    xhttp.send();
  }

  postReqUpdate(xhttp) {
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        // document.getElementById("demo").innerHTML = this.responseText;
        console.log(this.responseText);
      }
    };
    xhttp.open("POST", "/update", true);
    xhttp.send();
  }
}