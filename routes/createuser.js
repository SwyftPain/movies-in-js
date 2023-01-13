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
  console.log(name, password, email, mdpass);
  const test = await db.get(`users.${email}`);
  if (test == null) {
    await db.set(`users.${email}`, {
      username: name,
      password: mdpass,
      email: email,
      loggedin: false,
    });
    res.redirect("/login");
  } else {
    if (!test.username == name && !test.email == email) {
      await db.set(`users.${email}`, {
        username: name,
        password: mdpass,
        email: email,
        loggedin: false,
      });
      res.redirect("/login");
    } else {
      res.redirect("/error");
    }
  }
}

/* GET users listing. */
router.post("/", createUser);

module.exports = router;
