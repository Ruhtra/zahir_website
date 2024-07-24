const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const publicKeyPath = path.join(__dirname, "..", "..", "public_key.pem");
const privateKeyPath = path.join(__dirname, "..", "..", "private_key.pem");

console.log(publicKeyPath);

const opt = {
    publicKey: fs.readFileSync(publicKeyPath, "utf8"),
    privateKey: fs.readFileSync(privateKeyPath, "utf8"),
};

function signJwt(object, options) {
    return jwt.sign(object, opt.privateKey, {
        ...(options && options),
        algorithm: "RS256",
    });
}

function verifyJwt(token) {
    try {
        const decoded = jwt.verify(token, opt.publicKey);
        return {
            valid: true,
            expired: false,
            decoded,
        };
    } catch (e) {
        console.error(e);
        return {
            valid: false,
            expired: e.message === "jwt expired",
            decoded: null,
        };
    }
}

module.exports = {
    verifyJwt,
    signJwt
}