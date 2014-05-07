module.exports = function(list) {

  // build up the trials hash for quick lookup of
  // the next trial to be completed
  var trials = {}

  for (var i = 0; i < list.length; i+=1) {
    var trial = list[i]
    trials[trial.name] = trial
    trial.next = list[+1]
  })


  return function*(next) {
    var team = this.header['x-teamname']
    var trial = this.header['x-trial']
    var result = this.header['x-result']
    var trial = trials[name]

    if (!trial) {
      console.log('No trial found! %s', team)
      return this.status = 404
    }

    if (yield trial.verify(result)) {
      console.log('%s completed "%s"'.green, team, trial.name)
      this.status = 200
      var next = trial.next

      if (!next) {
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'.green)
        console.log(' %s has completed all %d trials!', team, list.length)
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'.green)
        return
      }

      this.set('x-trial', trial.name)
      this.body = yield next.puzzle()
    }
    else {
      console.log('%s attempted "%s" and failed.'.red, team, trial.name)
      this.status = 401
    }

  }

}