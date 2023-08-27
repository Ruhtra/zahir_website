const validate = require("../functions/validator.js");
const Database = require("../functions/queryDB.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET;

module.exports = {
    login: async (req, res) => {
        const {error, value} = validate.auth.login(req.body)
        if (error) throw error

        const user = await Database.auth.login(value.username, value.password)

        if(!user){
            return res.status(401).json({
                statusCode: 401,
                message: "Não foi possivel efetuar login",
                data: {
                    user: value.username
                }
            })
        }

        // const validacaoPassword = bcrypt.compareSync(value.password, user.password)
        //  if (!validacaoPassword) {
        //     return res.status(401).json({
        //         statusCode: 401,
        //         message: "Não foi possivel efetuar login",
        //         data: {
        //             user: value.username
        //         }
        //     })
        // }

        
        const token = jwt.sign({_id: user._id}, SECRET,{
            expiresIn: 60 * 60 * 24 // 1 day
        })

        return res.status(200).json({
            statusCode: 200,
            message: "Login realizado com sucesso!",
            data: {
                token: token
            }
        })
    },
    verifyJWT: async (req, res, next) => {
        const tokenHeader = req.headers["authorization"];
        const token = tokenHeader && tokenHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                statusCode: 401,
                message: "Não autorizado!",
            })
        }

        jwt.verify(token, SECRET);
        next();
    }
}