const { get } = require("lodash");
const { verifyJwt } = require("../utils/jwtUtil.js");
const { reIssueAccessToken } = require("../services/sessionService.js");

module.exports = {
    deserializeUser: async (req, res, next ) =>  {
        const accessToken =
            get(req, "cookies.accessToken") ||
            get(req, "headers.authorization", "").replace(/^Bearer\s/, "");
    
        const refreshToken =
            get(req, "cookies.refreshToken") || get(req, "headers.x-refresh");
    
        if (!accessToken) {
            return next();
        }
    
        const { decoded, expired } = verifyJwt(accessToken);
    
        if (decoded) {
            res.locals.user = decoded;
            return next();
        }
    
        if (expired && refreshToken) {
            const newAccessToken = await reIssueAccessToken({ refreshToken });
    
            if (newAccessToken) {
                res.setHeader("x-access-token", newAccessToken);
    
                res.cookie("accessToken", newAccessToken, {
                    maxAge: 900000, // 15 mins
                    httpOnly: true,
                    // domain: "localhost",
                    path: "/",
                    sameSite: "strict",
                    secure: true,
                });
            }
    
            const result = verifyJwt(newAccessToken);
    
            res.locals.user = result.decoded;
            return next();
        }
    
        return next();
    }
}