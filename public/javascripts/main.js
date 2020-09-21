function getLists() {
  var xmlHttpRequest = new XMLHttpRequest();
  xmlHttpRequest.open("GET", "http://localhost:3000/list", true);
  xmlHttpRequest.setRequestHeader("Content-Type", "application/json");
  xmlHttpRequest.setRequestHeader("Access-Control-Allow-Origin", "*");
  xmlHttpRequest.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        var colleges = [];
        var courses = [];

        colleges = JSON.parse(this.responseText).colleges;
        courses = JSON.parse(this.responseText).courses;

        for (i = 0; i < colleges.length; i++) {
          var college = document.createElement("option");
          college.text = colleges[i];
          college.value = colleges[i];
          document.getElementById("college").add(college);
        }
        for (i = 0; i < courses.length; i++) {
          var course = document.createElement("option");
          course.text = courses[i];
          course.value = courses[i];
          document.getElementById("course").add(course);
        }
      } else {
        console.log(this.status);
        console.log(this.responseText);
      }
    }
  };
  xmlHttpRequest.send();
}

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
        alert(JSON.parse(this.responseText).message);
        console.log(this.status);
        console.log(this.responseText);
      }
    }
  };
  xmlHttpRequest.send();
}
