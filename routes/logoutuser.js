var express = require("express");
var router = express.Router();
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const md5 = require("md5");

async function createUser(req, res) {
  let email = req.query.email;
  console.log(email);
  const test = await db.get(`users.${email}`);
  if(test == null) {
    res.redirect("/error");
  } else {
    await db.set(`users.${email}.loggedin`, false);
    res.redirect("/login");
}
}

/* GET users listing. */
router.post("/", createUser);

module.exports = router;
