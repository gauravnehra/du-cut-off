function getCutOff() {
  var course = document.getElementById("course").value;
  course = course.replace("+", "*plus"); // can't find a beeter solution to encode "+"
  var college = document.getElementById("college").value;
  var category = document.getElementById("category").value;

  var query =
    "course=" + course + "&college=" + college + "&category=" + category;

  query = encodeURI(query);

  var uri = "http://localhost:3000/cut-off?" + query;
  console.log(uri);
  var xmlHttpRequest = new XMLHttpRequest();
  xmlHttpRequest.open("GET", uri, true);
  xmlHttpRequest.setRequestHeader("Content-Type", "application/json");
  xmlHttpRequest.setRequestHeader("Access-Control-Allow-Origin", "*");
  xmlHttpRequest.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        alert("Your cut off = " + JSON.parse(this.responseText).cutOff);
      } else {
        console.log(this.status);
        console.log(this.responseText);
      }
    }
  };
  xmlHttpRequest.send();
}
