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
function(accessToken, refreshToken, profile, cb) {
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

In some use cases where the profile may be fetched more than once or you want to keep the user authenticated, refresh tokens may wish to be used. A package such as passport-oauth2-refresh can assist in doing this.

Example:

`npm install passport-oauth2-refresh --save`

```js
var LITauthStrategy = require('passport-discord').Strategy
  , refresh = require('passport-oauth2-refresh');

var litauthStrat = new LITauthStrategy({
    clientID: 'id',
    clientSecret: 'secret',
    callbackURL: 'callbackURL'
},
function(accessToken, refreshToken, profile, cb) {
    profile.refreshToken = refreshToken; // store this for later refreshes
    User.findOrCreate({ LITauthId: profile.id }, function(err, user) {
        if (err)
            return done(err);

        return cb(err, user);
    });
});

passport.use(litauthStrat);
refresh.use(litauthStrat);
```

... then if we require refreshing when fetching an update or something ...

```js
refresh.requestNewAccessToken('litauth', profile.refreshToken, function(err, accessToken, refreshToken) {
    if (err)
        throw; // boys, we have an error here.
    
    profile.accessToken = accessToken; // store this new one for our new requests!
});
```

## Examples

There is a example server in the `example` directory.

## Credits
* Nicholas Tay - basically copied passport-discord but modified it slightly to work for my use

## License
Licensed under the ISC license. The full license text can be found in the root of the project repository.