  //meta-modular.asynct.js
  var mm = require('meta-modular')
    , helper = require('meta-modular/helper')
    , helper2 = require('async_helper')
    , inspect = require('util').inspect
    , exports = {}
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
    var mm = require('meta-modular')('test')
  //  console.log("setup: " + inspect(test))
    mm.on('ready', function(){
      mm.clear(done)
    })
  }

  function teardown(test,done){
  //  console.log("teardown: " + inspect(test))
    var mm = require('meta-modular')('test').clear(done)
  }

  exports ['can clear added objects'] = function (test){
    var mm = require('meta-modular')('test')
      mm.addTest(tests.natural)
      test.deepEqual(mm.tests.get(tests.natural.test),tests.natural)
      mm.clear(cleared)
      function cleared(){    
        test.equal(mm.tests.get(tests.natural.test),undefined)
        test.finish()
      }
  }

  exports ['load a instance of meta-modular'] = function (test){
    var mm = require('meta-modular')('test')

    test.ok(mm instanceof require('meta-modular'),"require('meta-modular')('test') creates instance of require('meta-modular')")
    test.ok(mm instanceof require('meta-modular').MetaModular,"exports MetaModular type as ")

    test.finish()  
  }

  exports ['add_test and returns correct information about test'] = function (test){
    
    var mm = require('meta-modular')('test')
    mm.on('ready',helper2.isCalled(isReady))
    function isReady(_mm) {
      testAddTest(mm,tests.natural,test)

      testAddCandidate(mm,candidates.natural,test)
      testAddCandidate(mm,candidates.natural2,test)
      
      test.finish()  
    }
  }

  /*
  exports ['meta-modular can load a specific datastore'] = function (test){
    var isCalled = helper2.callChecker(500,test.finish).asserter(test)
        mm = require('meta-modular')('test')
        mm.on('ready',isCalled(isReady))
    
    function isReady(_mm) { 
    console.log("isReady!!!!!")
    test.equal(_mm,mm) }
  }*/

  exports ['addTest addCandidate then update, to run test!'] = function (test){
      
    var mm = require('meta-modular')('test')
      , isCalled = helper2.callChecker(2000,test.finish)

    testAddTest (mm,tests.natural,test)

    testAddCandidate (mm,candidates.natural,test)
    testAddCandidate (mm,candidates.natural2,test)

    mm.update_pair(tests.natural.test,candidates.natural,isCalled(updated1))
    mm.update_pair(tests.natural.test,candidates.natural2,isCalled(updated2))
      
    function updated1(status,report){
      testSuccess(mm,tests.natural,candidates.natural,test)
    }

    function updated2(status,report){
      testSuccess(mm,tests.natural,candidates.natural2,test)
    }
  }

  exports ['addTest addCandidate then update, to run test, with a failing test!'] = function (test){
    
    var mm = require('meta-modular')('test')
      , isCalled = helper2.callChecker(2000,test.finish)

    testAddTest(mm,tests.naturalRandom,test)

    testAddCandidate (mm,candidates.natural,test)
    testAddCandidate (mm,candidates.natural2,test)

    mm.update_pair(tests.naturalRandom.test,candidates.natural,isCalled(updated1))
    mm.update_pair(tests.naturalRandom.test,candidates.natural2,isCalled(updated2))
      
    function updated1(status,report){
      testFailure(mm,tests.naturalRandom,candidates.natural,test)
    }
    function updated2(status,report){
      testSuccess(mm,tests.naturalRandom,candidates.natural2,test)
    }
  }

  module.exports = require('async_testing').wrap({setup: setup,teardown:teardown,suite: exports})

  //check that the target is actually loaded!

  //then, lookup datastore in reverse to check find what passes a given test.

  //then, expand the syntax for refuring to a test...

  exports['can update multiple candiadtes at once'] = function (test){
    var mm = require('meta-modular')('test')

    testAddTest (mm,tests.naturalRandom,test)

    testAddCandidate (mm,candidates.natural,test)
    testAddCandidate (mm,candidates.natural2,test)
    
    mm.update_test(trial.test,updated)
      
    function updated(status,report){
      testFailure(mm,tests.naturalRandom,candidates.natural,test)
      testSuccess(mm,tests.naturalRandom,candidates.natural2,test)
      
      test.finish()    
    }
  }

  exports['can update multiple tests at once'] = function (test){
    var mm = require('meta-modular')('test')

    testAddTest (mm,tests.naturalRandom,test)
    testAddTest (mm,tests.natural,test)

    testAddCandidate (mm,candidates.natural,test)
    
    mm.update_candidate(candidates.natural,updated)
      
    function updated(status,report){
      testFailure(mm,tests.naturalRandom,candidates.natural,test)
      testSuccess(mm,tests.natural,candidates.natural,test)
      
      test.finish()    
    }
  }
  
  exports['can update everything at once'] = function (test){
    var mm = require('meta-modular')('test')

    testAddTest(mm,tests.naturalRandom,test)
    testAddTest(mm,tests.natural,test)

    testAddCandidate (mm,candidates.natural,test)
    testAddCandidate (mm,candidates.natural2,test)

    mm.update(updated)
      
    function updated(status,report){
      
      testSuccess(mm,tests.natural,candidates.natural,test)
      testSuccess(mm,tests.natural,candidates.natural2,test)

      testFailure(mm,tests.naturalRandom,candidates.natural,test)
      testSuccess(mm,tests.naturalRandom,candidates.natural2,test)

      test.finish()    
    }
  }
