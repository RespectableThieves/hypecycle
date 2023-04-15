# Expo Deployment

There is are two software components to a expo app. The native code which is updated via `eas build` & javascript which is updated via `eas update`. 

`eas build`s are handled manually right now and you can trigger them with 

```sh
yarn run eas build --profile <profile> --platform android
```

Right now we have two profiles. 

- `development` - which ships with the expo development client
- `preview` - which is our current "production" build.
- `production` - which is currently unused 

`eas update` is a little more complicated. There are two ways to target an update.

1. Branch - a collection of (javascript only) changes - similar to a git branch. 
2. Channel - a target native build. Any time you run a native build you can set the channel. Updates to that channel will be sent to that build. 

Right now we have a branch `main` connected to channel `preview`. And everytime we merge a PR we run. 

```
eas update --auto
```
Which creates a new update on branch `main` with the latest commit message and then publishes that to clients in `preview` channel.

__note__: There are ways to preview branches in the development build. It kinda works but I had to login to strava on every preview and it was a little annoying to work with. 
