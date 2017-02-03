# twitchForACause
Twitch charitable pledging web application

### Up and running
```npm install```
```gulp```

Should be running at http://localhost:9000
Check gulpfile.js for a list of commands. Just running gulp will build and run the project locally and watch most files for changes, although there is some bug in this where it won't always work. Can go over this file some more in detail in the coming days/weeks.

When you build and run it you're going to see an unbelieveable amount of SASS warnings.. haven't quite looked into surpressing them in the gulp task.. I'm sure its easy but I'm just lazy.

### Tech
Mongo/mongoose
Express
Angular
Node
  *passport.js for twitch auth
  *mongoose for db
  *node-cron for scheduled tasks (although you won't see any of this yet)
  
See package.json for a list of all the dependencies/node_modules we're using. 

### Testing
Karma (front end)
Jasmine
Mocha (node)
Protractor (e2e)