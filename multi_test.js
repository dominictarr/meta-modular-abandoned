/*
natural passes test/natural.child, but fails test/natural.random.child
natural2 passes test/natural.child, and test/natural.random.child

*/


var child = require('child/child_stdout2')
//var child = require('child/child')
  , assert = require('assert')
  , inspect = require('inspect')
  , Remapper = require('remap/remapper')
  , log = require('logger')
  
function MultiTest (){ // this does not need to be a class!

  this.run = run
  this.unsafe = unsafe
  
  /*
    time to standardidize the calling interface for a test runner.
    
    testname | {test : {replace : with}}
    , { onSuiteStart: ... 
      , onTestStart: ...
      , onTestDone: ...
      , onSuiteDone: ...
      , onError: ... }

    what if i just add support for remapping into child?
    
    it would have to send back the load report at exit, 
    or have two way communication.
  */
  
  function run (trial,finished,adapter) {
      var options = 
          { require: __filename
          , function: 'unsafe'
          , args: [trial,finished,adapter]
          , onError: error }

      child.run(options)

      function error(err){
        var report = {error: err}
        makeReport(trial,'loadError',report,[])
        finished('loadError',report)
      }
  }

  function unsafe (trial,opts,adapter){
    adapter = adapter || 'meta-test/asynct_adapter'

    assert.ok('string' === typeof trial.test,'trial.test is a string')
    assert.ok('string' === typeof trial.target,'trial.target is a string')
    assert.ok('string' === typeof trial.candidate,'trial.candidate is a string')

    remaps = {}
    remaps[trial.target] = trial.candidate
    var r = new Remapper(module,remaps)
      , finished 
    if('function' == typeof opts)
        finished = opts
      else
        finished = opts.onSuiteDone
      
    try {

      r.require(adapter).runTest(trial.test,{onSuiteDone: suiteDone, onError: onError})

    } catch (err) {
      onError(err)
    }

    function onError(error){
      
      var report = makeReport(trial,'loadError',{error: error})
      suiteDone('loadError',report)
      
    }

    function suiteDone(status,report){
      var err = undefined
              
      var loaded = r.loaded ? Object.keys(r.loaded) : []

       if(!report.error) // if there is already an error, don't over write it!
        if(loaded.indexOf(trial.candidate) == -1){

//         console.log('Loaded --- ' + inspect(r))

          err = new Error("test :" + trial.test + "\n"
            + "    did not load candidate: '" + trial.candidate + "'\n"
            + "    into target: '" + trial.target + "'\n"
            + "    instead loaded: " + inspect (loaded) + "\n"
            + "    should one of these be the target?" )

          report.error = err
          report.status = 'loadError'
          status = 'loadError'

        }
      makeReport(trial,status,report,loaded)

      finished(status,report) //make this more like normal (err,data)
    }
  }
}

exports.MultiTest = MultiTest

exports.run = function (trial,finished,adapter){
  new MultiTest().run(trial,finished,adapter)
}

exports.unsafe = function (trial,finished,adapter){
  new MultiTest().unsafe(trial,finished,adapter)
}

function makeReport(trial,status,report,loaded){
  report = report || {}
  report.test = trial.test // change to suite
  report.target = trial.target 
  report.candidate = trial.candidate 
  report.status = status // remove
  report.dependencies = loaded
  return report
}

