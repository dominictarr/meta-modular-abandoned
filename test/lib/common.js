/*

// c/p this into your test:

  var MetaModular = require('meta-modular')
    , common = require('./lib/common')// meta-modular testing help
    , tests = common.tests
    , candidates = common.candidates
    , passes = common.passes
    , testSuccess = common.testSuccess
    , testFailure = common.testFailure
    , testResult = common.testResult
    , testAddTest = common.testAddTest
    , testAddCandidate = common.testAddCandidate
    , setup = common.setup
    , teardown = common.teardown
*/

  var mm = require('meta-modular')
    , helper = require('meta-modular/helper')
    , helper2 = require('async_helper')
    , inspect = require('util').inspect
    , tests = 
        { natural: 
          { test: 'meta-modular/examples/test/natural.asynct'
          , target: 'meta-modular/examples/natural'
          }
        , naturalRandom: 
          { test: 'meta-modular/examples/test/natural.random.asynct'
          , target: 'meta-modular/examples/natural2'
          }
        }
    , candidates = 
        { natural: 'meta-modular/examples/natural'
        , natural2: 'meta-modular/examples/natural2'
        }
    , passes = {}

  passes[tests.natural.test] = {}
  passes[tests.naturalRandom.test] = {}
  passes[tests.natural.test][candidates.natural] = 'success'
  passes[tests.natural.test][candidates.natural2] = 'success'
  passes[tests.naturalRandom.test][candidates.natural] = 'failure'
  passes[tests.naturalRandom.test][candidates.natural2] = 'success'


  function testAddTest(mm,trial,test){
    mm.addTest (trial)
    test.equal(mm.tests.get(trial.test),trial)
  }

  function testAddCandidate(mm,cand,test){
    mm.addCandidate (cand)
    test.deepEqual(mm.candidates.get(cand),{})
  }

  function testSuccess(mm,trial,cand,assert){
    testResult(mm,trial,cand,'success',assert)
  }
  function testFailure(mm,trial,cand,assert){
    testResult(mm,trial,cand,'failure',assert)
  }
  function testResult(mm,trial,cand,result,assert){

    var results = mm.candidates.get(cand)
    assert.ok(results[trial.test],'MetaModular.candidates is updated with test results\n'
      + "expected results ok(" + cand + "["  + trial.test + "]),\n but it was :"
      +  inspect(results) )
    assert.equal(results[trial.test],result) //updates candidate record

    results_test = mm.tests.get(trial.test)
    assert.equal(results_test.run[cand],result) // updates test record
  }

  function setup(test,done){
    var mm = require('meta-modular')()
  //  console.log("setup: " + inspect(test))
    mm.on('ready', function(){
      mm.clear(done)
    })
  }

  function teardown(test,done){
  //  console.log("teardown: " + inspect(test))
    var mm = require('meta-modular')().clear(done)
  }

module.exports = {
  tests: tests
, candidates: candidates
, passes: passes
, testSuccess: testSuccess
, testFailure: testFailure
, testResult: testResult
, testAddTest: testAddTest
, testAddCandidate: testAddCandidate
}


