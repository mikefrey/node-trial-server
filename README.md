node-trial-server
=================

Learn node.js by being thrown in the deep-end. Run the server and
connect with the [trial-client](https://github.com/mikefrey/trial-client).

The developer will be prompted to write a solution to a challenge. For example:

```
$ node trials.js

Instructions for "http.get"

Provide a function that takes two arguments, `url` and `callback`. Make an HTTP
GET request to the provided url and run the callback with the body of the
response. Make sure you run the callback in the standard way, error first:
`callback(err, result)`.
```

Trials
------

Each trial and it's solution are in the `trials` directory. A trial must implement
the following api:

```javascript
module.exports = {

  // name your trial
  name: 'my cool trial',

  // the route section is optional. It adds an additional
  // route to the router in case the trial needs that
  // kind of interaction.
  route: {
    method: 'get',
    path: '/http/:id', // make sure this is unique across trials
    handler: function*(next) {
      this.body = 'hello'
    }
  },

  puzzle: function*() {
    // return any arguments to be given to the solving function
    // If an arry is returned, the function will be applied with
    // the elements of the array.
    return ['arg1', 'arg2']
  },

  verify: function*(result, options) {
    // should return true if the result is valid
    // or false if it is not valid.
    return true
  },

  description: 'description of the trial'

}
```

You can adjust which trials are used by changing the list of registered trials
in `server.js`.

Requirements
------------

Node.js v0.11.10 or greater is required, and must be run with the `--harmony` flag:

```
$ node --version
v0.11.11
$ node --harmony server.js
```

Setup
-----

```
$ git clone https://github.com/mikefrey/node-trial-server.git
$ cd node-trial-server
$ npm install
$ node --harmony server.js
Trials Server started at http://0.0.0.0:3001
```
