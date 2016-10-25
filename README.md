# HeatMap Widget and Demo

This is a little heatmap visualization I put together for Angular. This project has a server.js for the sake of demonstrating it by getting a data set from a data call and uses Mocha and supertest to test the endpoint.

My thought process was to get the widget working with nothing but Angular first. Then I thought I could add the slider functionality with a framework just to have the functionality, add a pop-up to the heatmap squares on hover to show the actual value, get the build process working, then circle back and create my own slider widget and create a canvas version if I had the time (not likely due to app launch at work and being on call and on edge 24/7).

### Features
 - material design
 - hover on a square to see value in a tooltip
 - slider to show and hide squares of different severity
 - reasonably responsive (still needs some work)
 - simple to plugin to project (just a directive controller and template)
 - canvas version (still rough around the edges, but created morning of 10/25/16)

### Tech

While HeatMap is just JavaScript/Angular, I used a few libraries for the server, task-running, and testing:

* [AngularJS](http://angularjs.org) - HTML enhanced for web apps!
* [Node.js](https://nodejs.org/) - evented I/O for the backend
* [Express](http://expressjs.com) - fast node.js network app framework [@tjholowaychuk]
* [Mocha](https://mochajs.org/) - Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser, making asynchronous testing simple and fun.
* [SuperTest](https://github.com/visionmedia/supertest) - Super-agent driven library for testing node.js HTTP servers using a fluent API
* [Grunt](http://gruntjs.com/) - The JavaScript Task Runner

### Installation

This requires [Node.js](https://nodejs.org/) v4+ to demonstrate/build.
Install global dependencies:
```sh
$ npm install grunt-cli bower mocha -g
```

Clone it, install the dependencies and devDependencies, and start the server.

```sh
$ cd heatmap
$ npm install
$ bower install
$ grunt dev
```

For production environments. Using this option puts views into minified template cache; annotates, concats, and minifies JS; and compiles, prefixes, and minifies less. It then serves the build in the same way as the 'grunt dev' process. In theory (haven't tested), you would be able to copy the "dist" folder along with the bower_components folder, the index.html file, and the result.css file to an Apache config and this demo would work if there was an endpoint to hit to get the data. The node modules were only for developing, building, and testing.

```sh
$ cd heatmap
$ npm install
$ bower install
$ grunt build
```

To run simple endpoint tests...
```sh
npm test
```

### Todos

 - Write More Tests
 - Make more responsive