var express = require("express");
var router = express.Router();
const pdf2excel = require("pdf-to-excel");
const xlsx = require("xlsx");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/cut-off", function (req, res, next) {
  var course = req.query.course.replace("*plus", "+"); // can't find a beeter solution to encode "+"
  var college = req.query.college;
  var category = req.query.category;

  var workbook = xlsx.readFile("./public/files/cut-off.xlsx");
  var sheet_name_list = workbook.SheetNames;
  var xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

  var cutOff = "";
  for (i = 0; i < xlData.length; i++) {
    if (xlData[i].__EMPTY === course) {
      cutOff = xlData[i][college];
      break;
    }
  }

  var cutOffArray = cutOff.split("\n");

  res.status(200).send({ message: "success", cutOff: cutOffArray[category] });
});

// using node-xlsx
// var obj = nodexlsx.parse("./public/files/cut-off.xlsx");
// console.log(obj[0].data[1]);

module.exports = router;
