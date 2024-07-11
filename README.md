# MyTube

This is a proof of concept to a larger generalization. The concept is that every website should provide a client api meant to be used in the console. You can just deliver the api as a namespaced word such as *MyTube*.

We are creating a youtube clone that pulls down videos from youtube and allows you to conrol it easily via commands. When creating new api commands, it's important to think about the intent rather than the actions someone would do normally.

For instance, if I wanted to read through the comments on a regular youtube page, you would scroll through the page and click on the comments to interact. Following this pattern won't work well for the command line. So what is the intent? To read through each comment and possibly react to it.

So one possible journey would be.

```javascript
// For convenience
const mt = MyTube;

const comments = mt.getComments();

// returns the current comment
comments.comment();
```
Returns
>According to GitRoll I'm a "Senior-level AI/ML Developer". I've never touched AI/ML but I expect a massive pay rise any second now

Then you could do
```javascript
comments.nextComment();
```
> This just proves that it's not AI that's the problem, it's people.

Say I want to reply
```javascript
comments.commment().reply("That's one way of looking at it.");
```

Or thumbs up
```javascript
comments.comment().thumbsUp();
```


## Other API Ideas (This can change)
* Video
  * Play, Pause, Stop
* RelatedVideos
    * related, nextRelated
        * Select
* Search
* Sign In
* Update Profile
* Notification
    * notification, nextNotification
        * Mark Read


Something to keep in mind. YouTube is one example where you couldn't replicate all the features in the terminal only. You need to be able to watch videos. And ideally you would see the video thumbnails before selecting a video. It would be interesting to see how much can be done via the console without having to leave the current video screen.