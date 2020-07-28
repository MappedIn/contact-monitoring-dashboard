const jwksRsa = require('jwks-rsa');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const { AUTH0_DOMAIN, AUTH0_AUDIENCE } = process.env;

function protectedRoutes(app) {
	passport.use(
		new JwtStrategy(
			{
				// Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
				secretOrKeyProvider: jwksRsa.passportJwtSecret({
					cache: true,
					rateLimit: true,
					jwksRequestsPerMinute: 5,
					jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
				}),
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

				// Validate the audience and the issuer.
				audience: AUTH0_AUDIENCE,
				issuer: `https://${AUTH0_DOMAIN}/`,
				algorithms: ['RS256'],
			},
			(jwt_payload, done) => {
				done(null, true);
			},
		),
	);

	app.use(passport.initialize());
	app.use('/api/*', passport.authenticate(['jwt'], { session: false }));

	require('./contact-events')(app);
	require('./device')(app);
	require('./mvf-bundle')(app);
}

module.exports = protectedRoutes;
