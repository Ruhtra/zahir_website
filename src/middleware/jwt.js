const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET;

module.exports = {
    verifyJWT: async (req, res, next) => {
        const tokenHeader = req.headers["authorization"];
        const token = tokenHeader && tokenHeader.split(" ")[1];

        if (token) {    
            try {
                jwt.verify(token, SECRET);
                req.permission = 'admin'
            } catch (err) { return res.redirect('/login') }
        }
        next()
    },
    requiredJWT: async (req, res, next) => {
        const tokenHeader = req.headers["authorization"];
        const token = tokenHeader && tokenHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                statusCode: 401,
                message: "Não autorizado!",
            })
        }3

        try {
            jwt.verify(token, SECRET);
            req.permission = 'admin'
        } catch (err) {
            return res.status(401).json({
                statusCode: 401,
                message: "Não autorizado!",
            })
        }
        next();
    },
    includeJWTInHeader: async (req, res, next) => {
        const token = req.cookies.jwt_token; // Substitua pelo nome correto do cookie
      
        if (token) {
          try {
            const decodedToken = jwt.verify(token, SECRET);
            req.headers['authorization'] = `Bearer ${token}`;
          } catch (err) {
            // Não faz nada se o token for inválido
          }
        }
      
        next();
      }
      
}