# passport-litauth

Passport strategy for authentication with [LITauth](https://auth.litdevs.org) through the OAuth 2.0 API.

## Usage
`npm install passport-litauth --save`

#### Configure Strategy
The LITauth authentication strategy authenticates users via a LITauth user account and OAuth 2.0 token(s). A LITauth API client ID, secret and redirect URL must be supplied when using this strategy. The strategy also requires a `verify` callback, which receives the access token, as well as a `profile` which contains the authenticated LITauth user's profile. The `verify` callback must also call `cb` providing a user to complete the authentication.

```javascript
var LITauthStrategy = require('passport-litauth').Strategy;

var scopes = ['identify', 'email'];

passport.use(new LITauthStrategy({
    clientID: 'id',
    clientSecret: 'secret',
    callbackURL: 'callbackURL',
    scope: scopes
},
function(accessToken, refreshToken, profile, cb) { //Although refreshToken is here it will always be undefined, LITauth doesn't supply one.
    User.findOrCreate({ LITauthId: profile.id }, function(err, user) {
        return cb(err, user);
    });
}));
```

#### Authentication Requests
Use `passport.authenticate()`, and specify the `'litauth'` strategy to authenticate requests.

For example, as a route middleware in an Express app:

```javascript
app.get('/auth/litauth', passport.authenticate('litauth'));
app.get('/auth/litauth/callback', passport.authenticate('litauth', {
    failureRedirect: '/'
}), function(req, res) {
    res.redirect('/secretstuff') // Successful auth
});
```

#### Refresh Token Usage

I lied, LITauth doesn't provide a refresh token at the time of writing.

## Examples

There is a example server in the `example` directory.

## Credits
* Nicholas Tay - basically copied passport-discord but modified it slightly to work for my use

## License
Licensed under the ISC license. The full license text can be found in the root of the project repository.