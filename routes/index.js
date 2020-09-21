var express = require("express");
var router = express.Router();
const pdf2excel = require("pdf-to-excel");
const xlsx = require("xlsx");
const nodexlsx = require("node-xlsx");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "DU Cut Off Calculator" });
});

router.get("/list", function (req, res, next) {
  var obj = nodexlsx.parse("./public/files/ba-cut-off.xlsx");

  var colleges = [];
  var courses = [];

  colleges = obj[0].data[0];
  colleges.shift();

  for (i = 1; i < obj[0].data.length; i++) {
    courses.push(obj[0].data[i][0]);
  }

  res
    .status(200)
    .send({ message: "Success", colleges: colleges, courses: courses });
});

router.get("/cut-off", function (req, res, next) {
  var course = req.query.course.replace("*plus", "+"); // can't find a beeter solution to encode "+"
  var college = req.query.college;
  var category = req.query.category;

  var workbook = xlsx.readFile("./public/files/ba-cut-off.xlsx");
  var sheet_name_list = workbook.SheetNames;
  var xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

  var cutOff = "";
  for (i = 0; i < xlData.length; i++) {
    if (xlData[i]["Name of Course"] === course) {
      cutOff = xlData[i][college];
      break;
    }
  }

  if (typeof cutOff === "undefined") {
    res.status(404).send({ message: "Not Found" });
  } else {
    cutOff = cutOff.replace(/([a-zA-Z])\w|\s|\t|\r/gm, "");

    var cutOffArray = cutOff.split("\n");

    if (cutOffArray[category] == "") {
      res.status(200).send({ message: "success", cutOff: "Closed or NA" });
    } else {
      res
        .status(200)
        .send({ message: "success", cutOff: cutOffArray[category] });
    }
  }
});

router.get("/valid-college", function (req, res, next) {
  var course = req.query.course.replace("*plus", "+"); // can't find a better solution to encode "+"
  var category = req.query.category;
  var marks = req.query.marks;

  var workbook = xlsx.readFile("./public/files/ba-cut-off.xlsx");
  var sheet_name_list = workbook.SheetNames;
  var xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

  var validColleges = [];
  for (i = 0; i < xlData.length; i++) {
    if (xlData[i]["Name of Course"] === course) {
      for (college in xlData[i]) {
        var cutOff = xlData[i][college];
        if (typeof cutOff === "undefined") {
          continue;
        } else {
          cutOff = cutOff.replace(/([a-zA-Z])\w|\s|\t|\r/gm, "");

          var cutOffArray = cutOff.split("\n");

          if (cutOffArray[category]) {
            if (marks >= cutOffArray[category]) {
              validColleges.push(college);
            }
          }
        }
      }
      break;
    }
  }

  if (validColleges.length <= 0) {
    res.status(404).send({ message: "Not Found" });
  } else {
    res.status(200).send({ message: "Success", validColleges: validColleges });
  }
});

// using node-xlsx
// var obj = nodexlsx.parse("./public/files/ba-cut-off.xlsx");
// console.log(obj[0].data[1]);

module.exports = router;
