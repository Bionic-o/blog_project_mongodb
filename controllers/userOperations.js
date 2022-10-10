const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Userlogin = require("../model/serverlogin");
const jwt = require("jsonwebtoken");
const mongodbConnection = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}?retryWrites=true&w=majority`;
const JWT_SECRET = process.env.JWT_SECRET;
mongoose.connect(mongodbConnection);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection failed"));

/* function authenticateToken(req, res, next) {
  console.log(req.headers);
  const authHeader = req.headers['authorization'];
  console.log(authHeader)
  const token = authHeader && authHeader.split("")[1];
  console.log(token);
  jwt.verify(token,JWT_SECRET, (err,decoded)=>{
    if(err) return res.sendStatus(403)
    req.user = decoded.username
})

  next();
} */

// PASSWORD VALIDATOR HELPER
function _checkPasswordValidation(value) {
  const isWhitespace = /^(?=.*\s)/;
  if (isWhitespace.test(value)) {
    throw Error("Password must not contain Whitespaces.");
  }

  const isContainsUppercase = /^(?=.*[A-Z])/;
  if (!isContainsUppercase.test(value)) {
    throw Error("Password must have at least one Uppercase Character.");
  }

  const isContainsLowercase = /^(?=.*[a-z])/;
  if (!isContainsLowercase.test(value)) {
    throw Error("Password must have at least one Lowercase Character.");
  }

  const isContainsNumber = /^(?=.*[0-9])/;
  if (!isContainsNumber.test(value)) {
    throw Error("Password must contain at least one Digit.");
  }

  const isValidLength = /^.{8,150}$/;
  if (!isValidLength.test(value)) {
    throw Error("Password must be more than 8 Characters Long.");
  }

  return;
}

// REGISTRATION
async function postUserRegister(userName, plainTextPassword, res) {
  if (!userName || typeof userName !== "string" || userName.length < 4) {
    throw new Error("invalid username");
  }
  _checkPasswordValidation(plainTextPassword);
  const hashedPassword = await bcrypt.hash(plainTextPassword, 10);

  console.log(hashedPassword);
  try {
    const response = await Userlogin.create({
      username: userName,
      password: hashedPassword,
    });
    console.log("you have added pass", response);
    res.status(201).json({ success: `New user ${userName} created!` });
  } catch (error) {
    console.log("Eriiiiiiiiiii", error);
    if (error.code === 11000) {
      throw Error("There is a same username in use");
    }
  }
}
// REGISTRATION IS COMPLETE AND IS WORKING



//LOGIN>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

async function postUserLogin(username, password, res) {
  const user = await Userlogin.findOne({ username }).lean();

  if (!user) {
    return res.status(401).send({ status: "error", error: "Invalid username" }); // 401 MEANS UNAUTHORIZED
  }
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    const roles = Object.values(user.roles).filter(Boolean);
    /* res.json({"success": `New user ${username} is logged in!`}) */
    const token = jwt.sign(
      { id: user._id, username: user.username , roles: roles},
      JWT_SECRET,
      { expiresIn: "10m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    await Userlogin.findOneAndUpdate(
      { username },
      { refreshToken: refreshToken }
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ status: "ok", accessToken: token, refreshToken: refreshToken, roles: [user.roles.User]   });
  } else {
    res.sendStatus(401);
  }
}

// CHANGE PASSWORD

async function postChangePassword(token, newPassword, res) {
  console.log(newPassword, "testttttt");
  _checkPasswordValidation(newPassword);
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const _id = user.id;

    const password = await bcrypt.hash(newPassword, 10);
    await Userlogin.findOneAndUpdate(
      { _id },
      {
        $set: { password },
      }
    );
    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: "error", error: "Erroooorr" });
  }
}
//REFRESH TOKEN

async function handleRefreshToken(cookies,  res) {
  console.log(cookies)
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }
  console.log(cookies.jwt);

  const refreshToken = cookies.jwt;
  const user = await Userlogin.findOne({ refreshToken: refreshToken }).lean();

  if (!user) return res.sendStatus(403);
  jwt.verify(refreshToken, JWT_SECRET, (err, decoded) => {
    if (err || user.username !== decoded.username) return res.sendStatus(403);
    const roles= [user.roles.User]
    console.log(roles)
    const accesToken = jwt.sign(
      {"username": decoded.username, "roles":roles},
      JWT_SECRET,
      {expiresIn:'10m'}
    )
    res.json({roles,accesToken})
  });
}

// LOGOUT, DELETE ACCESSTOKEN
async function logoutControll(cookies,  res) {
  if (!cookies?.jwt) {
    return res.status(204);
  }
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;
  const user = await Userlogin.findOne({ refreshToken: refreshToken }).lean();

  if (!user) {
    res.clearCookie('jwt',{httpOnly: true,sameSite:'None', secure:true}) //sameSite:'None', secure:true  ?????
    return res.sendStatus(204);
  }
  await Userlogin.findOneAndUpdate(
    { refreshToken: refreshToken },
    { refreshToken: '' }
  );
  res.clearCookie('jwt',{httpOnly: true,sameSite:'None', secure:true})
  res.sendStatus(204)
}


module.exports = {
  postUserRegister,
  postUserLogin,
  postChangePassword,
  handleRefreshToken,
  logoutControll
};
