# HeatMap

HeatMap is a little heatmap visualization I put together for Angular. This project has a server.js for the sake of auto-task running and uses Mocha and supertest to test the endpoint.

My thought process was to get the widget working with nothing but Angular first. Then I thought I could add the slider functionality with a framework just to have the functionality, add a pop-up to the heatmap squares on hover to show the actual value, then circle back and create my own slider widget if I had the time. 

### Tech

While HeatMap is just JavaScript/Angular, I used a few libraries for the server, task-running, and testing:

* [AngularJS](http://angularjs.org) - HTML enhanced for web apps!
* [Node.js](https://nodejs.org/) - evented I/O for the backend
* [Express](http://expressjs.com) - fast node.js network app framework [@tjholowaychuk]
* [Mocha](https://mochajs.org/) - Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser, making asynchronous testing simple and fun.
* [SuperTest](https://github.com/visionmedia/supertest) - Super-agent driven library for testing node.js HTTP servers using a fluent API
* [Grunt](http://gruntjs.com/) - The JavaScript Task Runner

### Installation

HeatMap requires [Node.js](https://nodejs.org/) v4+ to run.
Install global dependencies:
```sh
$ npm install grunt bower mocha -g
```

Clone it, install the dependencies and devDependencies, and start the server.

```sh
$ cd heatmap
$ npm install
$ bower install
$ grunt dev
```

For production environments...(haven't actually tested this yet, on todo)

```sh
$ cd heatmap
$ npm install
$ bower install
$ NODE_ENV=production
$ grunt build
```

To run simple endpoint tests...
```sh
npm test
```

### Todos

 - Write More Tests
 - Test/Debug/Rewrite production build (setup basics but haven't tried it yet)
 - Make more responsive
 - Stress tests it (need to verify everything is 100% accurate)
 - Move data specific logic to controller (wrote in directive before I realized it what I was doing)