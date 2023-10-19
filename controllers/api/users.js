const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const bcrypt = require('bcrypt');



module.exports = {
  create,
  logIn,
  checkToken
};

async function create(req, res) {
  try {
    // Add the user to the db
    console.log(req.body)
    const user = await User.create(req.body);
    const token = createJWT(user);
    res.json(token);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function logIn(req, res) {
  try {
    
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) throw new Error();
    const match = await bcrypt.compare(req.body.password, user.password);
    console.log(match)
    if (!match) throw new Error();
    const token = createJWT(user)
    res.json(token);
  } catch {
    res.status(400).json('Bad Credentials');
  }
}

function checkToken(req, res) {
  // req.user will always be there for you when a token is sent
  console.log('req.user', req.user);
  res.json(req.exp);
}

/*--- Helper Functions --*/

function createJWT(user) {
  return jwt.sign(
    // data payload
    { user },
    process.env.SECRET,
    { expiresIn: '24h' }
  );
}