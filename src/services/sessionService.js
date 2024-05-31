const { get } = require("lodash");
// const config = require("config");
const { v4: uuidv4 } = require("uuid");
// const { FilterQuery, UpdateQuery } = require("mongoose");
// const SessionModel, { SessionDocument } = require("../models/session.model");
const { verifyJwt, signJwt } = require("../utils/jwtUtil");
const { findUser: findUserr } = require("../routes/bdFake");
// const { findUser } from "./user.service";


const bdSessions = []


async function createSession(userId, userAgent) {
    //   const session = await SessionModel.create({ user: userId, userAgent });
    const session = {
        _id: uuidv4(),
        user: userId,
        userAgent: userAgent
    }
    bdSessions.push(session)

    return session;
}

// export async function findSessions(query: string) {
//   return SessionModel.find(query).lean();
// }

// export async function updateSession(
//   query: FilterQuery<SessionDocument>,
//   update: UpdateQuery<SessionDocument>
// ) {
//   return SessionModel.updateOne(query, update);
// }

async function reIssueAccessToken({ refreshToken }) {
    const { decoded } = verifyJwt(refreshToken);

    if (!decoded || !get(decoded, "session")) return false;

    //   const session = await SessionModel.findById(get(decoded, "session"));
    const session = bdSessions.find(e => e._id == get(decoded, "session"));

    if (!session /*|| !session.valid*/) return false;

    const user = await findUserr(session.user);

    if (!user) return false;

    const accessToken = signJwt(
        { ...user, session: session._id },
        { expiresIn: process.env.accessTokenTtl } // 15 minutes
    );

    return accessToken;
}

module.exports = {
    createSession,
    reIssueAccessToken
}