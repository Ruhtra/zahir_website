// import { get } from "lodash";
// import config from "config";
const { v4: uuidv4 } = require("uuid");
// import { FilterQuery, UpdateQuery } from "mongoose";
// import SessionModel, { SessionDocument } from "../models/session.model";
// import { verifyJwt, signJwt } from "../utils/jwt.utils";
// import { findUser } from "./user.service";


const bdSessions = []


module.exports.createSession =  async function createSession(userId, userAgent) {
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

// export async function reIssueAccessToken({
//   refreshToken,
// }: {
//   refreshToken: string;
// }) {
//   const { decoded } = verifyJwt(refreshToken);

//   if (!decoded || !get(decoded, "session")) return false;

//   const session = await SessionModel.findById(get(decoded, "session"));

//   if (!session || !session.valid) return false;

//   const user = await findUser({ _id: session.user });

//   if (!user) return false;

//   const accessToken = signJwt(
//     { ...user, session: session._id },
//     { expiresIn: config.get("accessTokenTtl") } // 15 minutes
//   );

//   return accessToken;
// }