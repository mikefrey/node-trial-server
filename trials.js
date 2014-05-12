var raw = require('raw-body')

module.exports = function(app, list) {

  // build up the trials hash for quick lookup of
  // the next trial to be completed
  var trials = {}

  for (var i = 0; i < list.length; i+=1) {
    var trial = list[i]
    trials[trial.name] = trial
    trial.next = list[i+1]

    if (trial.route) {
      app[trial.route.method](trial.route.path, trial.route.handler)
    }
  }

  app.all('/', function*(next) {
    var team = this.team = this.header['x-team']
    var name = this.header['x-trial']
    // var result = this.header['x-result']
    var options = this.header['x-options']
    var trial = trials[name]

    var result = yield function(done) {
      raw(this.req, { encoding:'utf8' }, done)
    }

    if (result) result = (new Buffer(result, 'base64'))

    if (!trial) {
      console.log('\nNo trial found! %s', team)
      return this.status = 404
    }

    try { options = JSON.parse(options) }
    catch (ex) {}

    if (yield trial.verify.call(this, result, options.args)) {
      console.log('%s completed "%s"'.green, team, trial.name)
      this.status = 200
      var nextTrial = trial.next

      if (!nextTrial) {
        console.log('\n\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'.rainbow)
        console.log(' %s has completed all %d trials!', team.blue, list.length-1) // start doesn't count
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'.rainbow)
        this.body = {}
        return
      } else {
        console.log('\nUp next for %s, %s', team.blue, nextTrial.name)
      }

      this.set('x-trial', nextTrial.name)
      this.body = {
        args: yield nextTrial.puzzle.call(this),
        description: nextTrial.description,
        stream: !!nextTrial.stream
      }
    }
    else {
      console.log('\n%s attempted "%s" and failed.'.red, team, trial.name)
      this.status = 401
    }

  })

}