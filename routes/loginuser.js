var express = require("express");
var router = express.Router();
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const md5 = require("md5");

async function createUser(req, res) {
  let name = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  let mdpass = md5(password);
  console.log("login user");
  const test = await db.get(`users.${email}`);
  if(test == null) {
    console.log("Null");
    res.redirect("/error");
  } else {
  if (test.email == email && test.password == mdpass) {
    await db.set(`users.${email}.loggedin`, true);
    console.log(test);
    res.redirect("/?email=" + email);
  } else {
    console.log("Wrong email or pass")
    res.redirect("/error");
  }
}
}

/* GET users listing. */
router.post("/", createUser);

module.exports = router;
