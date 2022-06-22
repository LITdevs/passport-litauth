/**
 * Dependencies
 */
var OAuth2Strategy      = require('passport-oauth2')
  , InternalOAuthError  = require('passport-oauth2').InternalOAuthError
  , util                = require('util');

/**
 * Options for the Strategy.
 * @typedef {Object} StrategyOptions
 * @property {string} clientID
 * @property {string} clientSecret
 * @property {string} callbackURL
 * @property {Array} scope
 * @property {string} [authorizationURL="https://auth.litdevs.org/oauth/authorize"]
 * @property {string} [tokenURL="https://auth.litdevs.org/api/oauth2/token"]
 * @property {string} [scopeSeparator=" "]
 */
/**
 * `Strategy` constructor.
 *
 * The LITauth authentication strategy authenticates requests by delegating to
 * LITauth via the OAuth2.0 protocol
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * and service-specific `profile`, and then calls the `cb`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid. If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`       OAuth ID to litauth
 *   - `clientSecret`   OAuth Secret to verify client to litauth
 *   - `callbackURL`    URL that litauth will redirect to after auth
 *   - `scope`          Array of permission scopes to request
 *                      Check the official documentation for valid scopes to pass as an array.
 * 
 * @constructor
 * @param {StrategyOptions} options
 * @param {function} verify
 * @access public
 */

function Strategy(options, verify) {
    options = options || {};
    options.authorizationURL = options.authorizationURL || 'https://auth.litdevs.org/oauth/authorize';
    options.tokenURL = options.tokenURL || 'https://auth.litdevs.org/api/oauth2/token';
    options.scopeSeparator = options.scopeSeparator || ' ';

    OAuth2Strategy.call(this, options, verify);
    this.name = 'litauth';
    this._oauth2.useAuthorizationHeaderforGET(true);
}

/**
 * Inherits from `OAuth2Strategy`
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from Discord.
 *
 * This function constructs a normalized profile.
 * Along with the properties returned from /user, properties returned include:
 *   - `fetchedAt`        When the data was fetched as a `Date`
 *   - `email`			  The user's email address if you requested the email scope
 *   - `accessToken`      The access token used
 *
 * @param {string} accessToken
 * @param {function} done
 * @access protected
 */

 Strategy.prototype.userProfile = function(accessToken, done) {
    var self = this;
    this._oauth2.get('https://auth.litdevs.org/api/user', accessToken, function(err, body, res) {
        if (err) {
            return done(new InternalOAuthError('Failed to fetch the user profile.', err))
        }

        try {
            var parsedData = JSON.parse(body);
        }
        catch (e) {
            return done(new Error('Failed to parse the user profile.'));
        }

        var profile = parsedData; // has the basic user stuff
        profile.provider = 'litauth';
        profile.accessToken = accessToken;

        self.checkScope('email', accessToken, function(errx, email) {
            if (errx) done(errx);
            if (email) profile.email = email;
			profile.fetchedAt = new Date();
			return done(null, profile)
        });
    });
};

Strategy.prototype.checkScope = function(scope, accessToken, cb) {
    if (this._scope && this._scope.indexOf(scope) !== -1) {
        this._oauth2.get('https://auth.litdevs.org/api/user/' + scope, accessToken, function(err, body, res) {
            if (err) return cb(new InternalOAuthError('Failed to fetch user\'s ' + scope, err));
            try {
                var json = JSON.parse(body);
            }
            catch (e) {
                return cb(new Error('Failed to parse user\'s ' + scope));
            }
            cb(null, json.email);
        });
    } else {
        cb(null, null);
    }
}
/**
 * Options for the authorization.
 * @typedef {Object} authorizationParams
 */
/**
 * Return extra parameters to be included in the authorization request.
 *
 * @param {authorizationParams} options
 * @return {Object}
 * @api protected
 */
 Strategy.prototype.authorizationParams = function(options) {
    var params = {};
    /*if (typeof options.permissions !== 'undefined') {
        params.permissions = options.permissions;
    }
    if (typeof options.prompt !== 'undefined') {
        params.prompt = options.prompt;
    }*/
    return params;
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;