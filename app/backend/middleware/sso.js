const ssoExpress = require("@bcgov-cas/sso-express").default;

let ssoServerHost;
if (!process.env.NAMESPACE || process.env.NAMESPACE.endsWith("-dev"))
  ssoServerHost = "dev.oidc.gov.bc.ca";
else if (process.env.NAMESPACE.endsWith("-test"))
  ssoServerHost = "test.oidc.gov.bc.ca";
else ssoServerHost = "oidc.gov.bc.ca";

async function middleware() {
  return ssoExpress({
    applicationDomain: ".gov.bc.ca",
    getLandingRoute: (req) => {
      if (req.query.redirectTo) return req.query.redirectTo;
    },
    oidcConfig: {
      baseUrl:
        process.env.HOST || `http://localhost:${process.env.PORT || 3000}`,
      clientId: "connectivity-intake-2014",
      oidcIssuer: `https://${ssoServerHost}/auth/realms/onestopauth-basic`
    },
  });
}

module.exports = middleware;
