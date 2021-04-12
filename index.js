const express = require("express");
const cors = require("cors");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config();

const AUTH0_JWKS_URI = process.env.AUTH0_JWKS_URI;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;
const AUTH0_ISSUER = process.env.AUTH0_ISSUER;
const PORT = process.env.PORT;

const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: AUTH0_JWKS_URI,
  }),

  // Validate the audience and the issuer.
  audience: AUTH0_AUDIENCE,
  issuer: [AUTH0_ISSUER],
  algorithms: ["RS256"],
});

const app = express();

app.use(morgan("dev"));

app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Homepage" });
});

app.get("/api/protect", checkJwt, (req, res) => {
  res.json({ message: "Welcome to Protect API" });
});

app.listen(PORT, () => {
  console.log(`Server start at PORT ${PORT}`);
});
