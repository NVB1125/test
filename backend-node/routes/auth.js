var jwt = require("express-jwt");
const secret = "jwt-secret";

function getTokenFromHeader(req) {
  if (req.headers.bearer) {
      return req.headers.bearer;
    }
  return null;
}

var auth = {
  required: jwt({
    secret: secret,
    userProperty: "payload",
    getToken: getTokenFromHeader
  }),
  optional: jwt({
    secret: secret,
    userProperty: "payload",
    credentialsRequired: false,
    getToken: getTokenFromHeader,
  }),
};

module.exports = auth;
