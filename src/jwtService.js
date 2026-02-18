import { readFileSync } from "fs";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

export function generateClientAssertion(config) {

    const privateKey = readFileSync(config.privateKeyPath, "utf8");

    const now = Math.floor(Date.now() / 1000);

    const payload = {
        aud: config.tokenUrl,
        exp: now + (30 * 60),
        nbf: now,
        sub: config.clientId,
        iss: config.clientId,
        iat: now,
        jti: uuid()
    };

    return jwt.sign(payload, privateKey, {
        algorithm: "RS256"
    });
}
