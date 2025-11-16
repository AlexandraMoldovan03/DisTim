import { expressjwt } from "express-jwt";
import jwks from "jwks-rsa";

export const checkJwt = expressjwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    jwksUri: `${process.env.AUTH0_DOMAIN}.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `${process.env.AUTH0_DOMAIN}`,
  algorithms: ["RS256"]
});
