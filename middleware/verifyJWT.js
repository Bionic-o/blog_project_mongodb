const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    console.log(req.body)
    const authHeader = req.headers.authorization ||req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    console.log('inside JWT',authHeader ); // Bearer token
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, decoded) => {
            
            if (err) return res.sendStatus(403); //invalid token
            console.log(req.roles)
            console.log(decoded.username, decoded.roles.User+ 'injaaaaaaa')
            req.user = decoded.username;
            req.roles= decoded.roles;
            
            next();
        }
    );
}

module.exports = verifyJWT