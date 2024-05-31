const { Router } = require("express")
const { stringify } = require("qs");
const { createSession } = require("../services/sessionService");
const axios = require("axios");
// const jwt = require("jsonwebtoken");
const { signJwt } = require("../utils/jwtUtil");
const { findAndUpdateUserr } = require("./bdFake");


const use = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}

const router = Router();

// googletoken
async function getGoogleOauthToken(code) {
    const url = "https://oauth2.googleapis.com/token"

    const values = {
        code,
        client_id: process.env.GOOGLE_CLEINT_ID,
        client_secret: process.env.GOOGLE_CLEINT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URL,
        grant_type: "authorization_code"
    };

    try {
        const res = await axios.post(url, stringify(values), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        return res.data
    } catch (err) {
        console.log("error in fetch Google oauth tokens ")
        throw new Error(err)
    }

}

// googleuser
async function getGoogleuser(id_token, access_token) {
    try {
        const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
            headers: {
                Authorization: `Bearer ${id_token}`
            }
        })
        return res.data
    } catch (error) {
        console.log(error, "Error ftchig Google user");
        throw new Error(error);
    }

}



// cookie
const accessTokenCookkieoptions = {
    maxAge: 15 * 60 * 1000, // 15 min
    httpOnly: true,
    domain: process.env.production ? "https://zahir-website.onrender.com": "localhost",
    path: "/",
    sameSite: "strict",
    secure: true
}
const refreshTokenCookieOptions = {
    ...accessTokenCookkieoptions,
    maxAge: 3.154e10 // 1 year
}


router.get('/oauth/google', use(async (req, res) => {


    // Obtém o token de acesso com o google
        const code = req.query.code
        if (!code) throw new Error("Code params not defined")
        const { id_token, access_token } = await getGoogleOauthToken(code)


    // Obtém informações do usuario com o token
        // const googleUser = jwt.decode(id_token)
        const googleUser = await getGoogleuser(id_token, access_token)


    // filtra usuários que não tem email verificado
        if (!googleUser.verified_email) return res.status(403).send("Google account is not verified")
    

    // atualiza o usuário no banco de dados
        const user = await findAndUpdateUserr({ email: googleUser.email, }, {
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture,
        })

    //Criando sessão
    const session = await createSession(user._id, req.get("user-agent") || "")

    const accessToken = signJwt(
        { ...user, session: session._id },
        { expiresIn: process.env.accessTokenTtl } // 15 minutes
    );

    const refreshToken = signJwt(
        { ...user, session: session._id },
        { expiresIn: process.env.refreshTokenTtl} // 1 year
      );


    // Retornar o access_token e o refresh_token
    res.cookie("accessToken", accessToken, accessTokenCookkieoptions)
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions)

    // Redirectiona para a página correta

    // return res.redirect("https://localhost:5173/")
    return res.redirect("https://sitedozahir.com/")
}))

router.get("/getUser", use((req, res, next) => {
    const user = res.locals.user;

    if (!user) return res.sendStatus(403);
    
    return res.send(res.locals.user);
}))


module.exports = router
