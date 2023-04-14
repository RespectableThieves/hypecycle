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

Right now. We are avoiding the use of branches and just using channels. So all we every need is.

```
eas update --channel preview
```

But this will get run on every push to the `main` branch.
