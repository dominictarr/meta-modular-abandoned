//multi_test.asynct.js

var describe = require('should').describe
  , MultiTest = require('meta-modular/multi_test')
  , inspect = require('inspect')
  , style = require('style')
function isCalled(test,func,deadline,obj){
  deadline = deadline || 2000
  var time = setTimeout(tooLate,deadline)

  return function (){
    clearTimeout(time)
    func.apply(obj,arguments)
  }

  function tooLate(){
    test.ok(false,"expected function " + func.name + " to have been called within " + deadline + " milliseconds")
  }
}

/*exports['run a test against object which module.exports =  function'] = function (test){
  var mt = MultiTest
    , trial = 
        { test: 'query/query.asynct.js'
        , target: 'query'
        , candidate: 'query'
        }
  checkTestTrial(test,'success',trial,test.finish)
}*/


function checkTestTrial (test,status,trial,next){
  var it = describe(trial,"A MultiTest trial")
    it.should.have.property('candidate').a('string')
    it.should.have.property('target').a('string')
    it.should.have.property('test').a('string')

  MultiTest.run(trial,makeCheckResult(status))

  function makeCheckResult(status){

    return isCalled(test,checkResult) 
    
    function checkResult(status,report){

    test.ifError(report.error)
      

      test.equal(report.test,trial.test,'report has correct .test property')
      test.equal(report.target,trial.target,'report has correct .target property')
      test.equal(report.candidate,trial.candidate,'report has correct .candidate property')
      
      test.equal(report.status,status,
        ["expected" , trial.candidate, 'to return status \'', status, '\' at test :' , trial.test].join(' ') )
      next()
    }
  }
}


exports['run a test'] = function (test){

  var mt = MultiTest
    , trial = 
        { test: 'meta-modular/examples/test/natural.asynct.js'
        , target: 'meta-modular/examples/natural'
        , candidate: 'meta-modular/examples/natural'
        }
  checkTestTrial(test,'success',trial,test.finish)
}


exports['run a test with a candidate in place of a target'] = function (test){

  var mt = MultiTest
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
  checkTestTrial(test,'failure',fail_trial,next)
  function next(){
    checkTestTrial(test,'success',pass_trial,test.finish)
  }
}

exports ['make error if test did not load the candidate as target'] = function (test){
 var mt = MultiTest
    , wrongTargetTrial = 
        { test: 'meta-modular/examples/test/natural.random.asynct'
        , target: 'XXXXX'
        , candidate: 'meta-modular/examples/natural'
        }
  MultiTest.run(wrongTargetTrial,c)
  function c(status,report){
   test.ok(/did not load candidate/.exec(report.error.message))
//    test.ok(report.error instanceof Error, "expected error because target was not loaded, but got: " + inspect(report.error) )
   test.finish()
  }
}

exports ['catch error during running module'] = function (test){
var mt = MultiTest
    , wrongCandidateTrial = 
        { test: 'meta-modular/examples/test/natural.random.asynct'
        , target: 'meta-modular/examples/natural2'
        , candidate: 'meta-modular/examples/test/natural.random.asynct'
        }

  MultiTest.run(wrongCandidateTrial ,c)

  function c(status,report){
    test.equal(status,'error')
   test.finish()
  }
}
/**/

exports ['catch error when candidate cannot be resolved'] = function (test){
var mt = MultiTest
    , wrongCandidateTrial = 
        { test: 'meta-modular/examples/test/natural.random.asynct'
        , target: 'meta-modular/examples/natural2'
        , candidate: 'xxxxxxxxxx'
        }

  MultiTest.run(wrongCandidateTrial ,c)

  function c(status,report){
//    test.ifError(report.error)
    test.ok(report.error.message)
    test.ok(/Cannot find module/.exec(report.error.message),"expected a cannot resolve module error")
    test.equal(status,'loadError')

   test.finish()
  }
}


exports ['catch fatal error running module'] = function (test){
var mt = MultiTest
    , wrongCandidateTrial = 
        { test: 'meta-modular/examples/test/natural.random.asynct'
        , target: 'meta-modular/examples/natural2'
        , candidate: 'meta-modular/examples/syntax_error'
        }

  MultiTest.run(wrongCandidateTrial ,c)

  function c(status,report){
//    test.ifError(report.error)
    test.equal(status,'loadError')

    test.finish()
  }
}

//to securely catch an async error caused by module substitution, we'll need to run it as a seperate process
/**/

