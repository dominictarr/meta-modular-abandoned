//multi_test.asynct.js

var MultiTest = require('meta-modular/multi_test')
  , inspect = require('util').inspect
function isCalled(test,func,deadline,obj){
  deadline = deadline || 500
  var time = setTimeout(tooLate,deadline)

  return function (){
    clearTimeout(time)
    func.apply(obj,arguments)
  }

  function tooLate(){
    test.ok(false,"expected function " + func + " to have been called within " + deadline + " milliseconds")
  }
}

function checkTestTrial (test,pass,trial,next){

  new MultiTest().run(trial,makeCheckResult(pass))

  function makeCheckResult(pass){
    var zero = pass ? 'numFailures' : 'numSuccesses'
      , oneOrMore = pass ? 'numSuccesses' : 'numFailures'
      , result = pass ? 'pass' : 'fail'
    return isCalled(test,checkResult) 
    
    function checkResult(status,report){
      test.equal(report.status,'complete')
      console.log(report)

      test.equal(report.test,trial.test,'report has correct .test property')
      test.equal(report.target,trial.target,'report has correct .target property')
      test.equal(report.candidate,trial.candidate,'report has correct .candidate property')
      
      test.equal(report[zero],0,"expected " + trial.candidate + " to " + result + " test: " + trial.test + " (" + zero + " === 0)" )
      test.ok(report[oneOrMore] > 0,"expected " + trial.candidate + " to " + result + " test: " + trial.test + " (" + oneOrMore + " > 0)")
      console.log(report)
      next()
    }
  }
}

exports['run a test'] = function (test){

  var mt = new MultiTest()
    , trial = 
        { test: 'meta-modular/examples/test/natural.asynct.js'
        , target: 'meta-modular/examples/natural'
        , candidate: 'meta-modular/examples/natural'
        }
  checkTestTrial(test,true,trial,test.finish)
}

exports['run a test with a candidate in place of a target'] = function (test){

  var mt = new MultiTest()
    , fail_trial = 
        { test: 'meta-modular/examples/test/natural.random.asynct'
        , target: 'meta-modular/examples/natural2'
        , candidate: 'meta-modular/examples/natural'
        }
    , pass_trial = 
        { test: 'meta-modular/examples/test/natural.random.asynct'
        , target: 'meta-modular/examples/natural2'
        , candidate: 'meta-modular/examples/natural2'
        }
  checkTestTrial(test,false,fail_trial,next)
  function next(){  
    checkTestTrial(test,true,pass_trial,test.finish)
  }
}

exports ['make error if test did not load the candidate as target'] = function (test){
 var mt = new MultiTest()
    , wrongTargetTrial = 
        { test: 'meta-modular/examples/test/natural.random.asynct'
        , target: 'XXXXX'
        , candidate: 'meta-modular/examples/natural'
        }
  new MultiTest().run(wrongTargetTrial,c)
  function c(err,report){
    test.ok(err instanceof Error,"expected error because target was not loaded, but got: " + inspect(err) )
   test.finish()
  }
}
