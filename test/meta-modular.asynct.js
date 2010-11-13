//meta-modular.asynct.js
var mm = require('meta-modular')
  , helper = require('meta-modular/helper')
  , helper2 = require('async_helper')
  , inspect = require('util').inspect
  , exports = {}

/*
exports['can add test, candidate and then trial candidate in test'] = function (test){
mm.addTest (tests.json)
mm.addCandidate (implementation.js)

//wait for message that it's found the test, and the implementation
mm.on('added',function (added){
  if (mm.get('testname') && mm.get('implementation')){
  mm.update ('testname','implementation',updated)  
  }
}
//mm.update ('testname') // finds the test and tries it against each module.
//mm.update ('implementation') // finds the test and tries it against each module.
//mm.update ('testname','implementation') run implementation through testname

}*/

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
    , trial = {
          test: 'meta-modular/examples/test/natural.asynct'
        , target:  'meta-modular/examples/natural'
        , engine: 'asynct' // how to run the test...
        }
    mm.addTest(trial)
    test.deepEqual(mm.tests.get(trial.test),trial)
    mm.clear(cleared)
    function cleared(){    
      test.equal(mm.tests.get(trial.test),undefined)
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
    , trial = {
        test: 'meta-modular/examples/test/natural.asynct'
      , target:  'meta-modular/examples/natural'
      , engine: 'asynct' // how to run the test...
      }
    , candidate1 = 'meta-modular/examples/natural'
    , candidate2 = 'meta-modular/examples/natural2'
  var mm = require('meta-modular')('test')
  mm.on('ready',helper2.isCalled(isReady))
  function isReady(_mm) {
    mm.addTest (trial)
    test.equal(mm.tests.get(trial.test),trial)

    mm.addCandidate (candidate1)
    mm.addCandidate (candidate2)

    test.deepEqual(mm.candidates.get(candidate1),{})
    test.deepEqual(mm.candidates.get(candidate1),{})

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
    , trial = {
        test: 'meta-modular/examples/test/natural.asynct'
      , target:  'meta-modular/examples/natural'
      , engine: 'asynct' // how to run the test...
      }
    , isCalled = helper2.callChecker(2000,test.finish)
    , candidate1 = 'meta-modular/examples/natural'
    , candidate2 = 'meta-modular/examples/natural2'

//  var mm = require('meta-modular')('test')
    
    mm.addTest (trial)
    test.equal(mm.tests.get(trial.test),trial)

    mm.addCandidate (candidate1)
    mm.addCandidate (candidate2)

    test.deepEqual(mm.candidates.get(candidate1),{})
    test.deepEqual(mm.candidates.get(candidate1),{})

    mm.update_pair(trial.test,candidate1,isCalled(updated1))
    mm.update_pair(trial.test,candidate2,isCalled(updated2))
    
    function updated1(status,report){
      var results = mm.candidates.get(candidate1)
      test.ok(results[trial.test],'MetaModular.candidates is updated with test results')
      test.equal(results[trial.test],'success') //updates candidate record

      results_test = mm.tests.get(trial.test)
      test.equal(results_test.run[candidate1],'success') // updates test record
    }
    
    function updated2(status,report){
      var results = mm.candidates.get(candidate2)
      test.ok(results[trial.test],'MetaModular.candidates is updated with test results')
      test.equal(results[trial.test],'success') //updates candidate record

      results_test = mm.tests.get(trial.test)
      test.equal(results_test.run[candidate2],'success') // updates test record
    }
}


exports ['addTest addCandidate then update, to run test, with a failing test!'] = function (test){
  
  var mm = require('meta-modular')('test')
    , trial = {
        test: 'meta-modular/examples/test/natural.random.asynct'
      , target:  'meta-modular/examples/natural2'
      , engine: 'asynct' // how to run the test...
      }
    , candidate1 = 'meta-modular/examples/natural'
    , candidate2 = 'meta-modular/examples/natural2'
    , mm = require('meta-modular')('test')
    , isCalled = helper2.callChecker(2000,test.finish)

    mm.addTest (trial)
    test.equal(mm.tests.get(trial.test),trial)

    mm.addCandidate (candidate1)
    mm.addCandidate (candidate2)

    test.deepEqual(mm.candidates.get(candidate1),{})
    test.deepEqual(mm.candidates.get(candidate1),{})

    mm.update_pair(trial.test,candidate1,isCalled(updated1))
    mm.update_pair(trial.test,candidate2,isCalled(updated2))
    
    function updated1(status,report){
      var results = mm.candidates.get(candidate1)
      test.ok(results[trial.test],'MetaModular.candidates is updated with test results')
      test.equal(results[trial.test],'failure') //updates candidate record

      results_test = mm.tests.get(trial.test)
      test.equal(results_test.run[candidate1],'failure') // updates test record

    }
    function updated2(status,report){
      var results = mm.candidates.get(candidate2)
      test.ok(results[trial.test],'MetaModular.candidates is updated with test results')
      test.equal(results[trial.test],'success') //updates candidate record

      results_test = mm.tests.get(trial.test)
      test.equal(results_test.run[candidate2],'success') // updates test record
 
    }
}

module.exports = require('async_testing').wrap({setup: setup,teardown:teardown,suite: exports})

//check that the target is actually loaded!

//then, lookup datastore in reverse to check find what passes a given test.

//then, expand the syntax for refuring to a test...

exports['can update multiple candiadtes at once'] = function (test){
    var trial = {
          test: 'meta-modular/examples/test/natural.random.asynct'
        , target:  'meta-modular/examples/natural2'
        , engine: 'asynct' // how to run the test...
        }
      , candidate1 = 'meta-modular/examples/natural'
      , candidate2 = 'meta-modular/examples/natural2'
      , mm = require('meta-modular')('test')
//      , isCalled = helper2.callChecker(1,finish)
//if I use callChecker in this function

    mm.addTest (trial)
    test.equal(mm.tests.get(trial.test),trial)

    mm.addCandidate (candidate1)
    mm.addCandidate (candidate2)

    test.deepEqual(mm.candidates.get(candidate1),{})
    test.deepEqual(mm.candidates.get(candidate2),{})
    
//    mm.update_test(trial.test,isCalled(updated))
      mm.update_test(trial.test,updated)
      
    function updated(status,report){
//      console.log("################################################################################################")
      var result1 = mm.candidates.get(candidate1)
        , result2 = mm.candidates.get(candidate2)
        , test_result = mm.tests.get(trial.test)

      test.ok(result1[trial.test],'MetaModular.candidates is updated with test results')
      test.ok(result2[trial.test],'MetaModular.candidates is updated with test results')
        
      test.equal(mm.candidates.get(candidate1)[trial.test],'failure')
      test.equal(mm.candidates.get(candidate2)[trial.test],'success')
      
      test.finish()    
    }
}

exports['can update multiple tests at once'] = function (test){
    var trial1 = {
          test: 'meta-modular/examples/test/natural.random.asynct'
        , target:  'meta-modular/examples/natural2'
        , engine: 'asynct' // how to run the test...
        }
        trial2 = {
          test: 'meta-modular/examples/test/natural.asynct'
        , target:  'meta-modular/examples/natural'
        , engine: 'asynct'
        }
   
      , candidate1 = 'meta-modular/examples/natural'
      , mm = require('meta-modular')('test')

    mm.addTest (trial1)
    mm.addTest (trial2)

    test.equal(mm.tests.get(trial1.test),trial1)
    test.equal(mm.tests.get(trial2.test),trial2)

    mm.addCandidate (candidate1)

    test.deepEqual(mm.candidates.get(candidate1),{})
    
    mm.update_candidate(candidate1,updated)
      
    function updated(status,report){
      var result = mm.candidates.get(candidate1)

        , test_result1 = mm.tests.get(trial1.test)
        , test_result2 = mm.tests.get(trial2.test)

      test.ok(result[trial1.test],'MetaModular.candidates is updated with test results')
      test.ok(result[trial2.test],'MetaModular.candidates is updated with test results')
        
      test.equal(mm.candidates.get(candidate1)[trial1.test],'failure')
      test.equal(mm.candidates.get(candidate1)[trial2.test],'success')
      
      test.finish()    
    }
}

exports['can update everything at once'] = function (test){
    var trial1 = {
          test: 'meta-modular/examples/test/natural.random.asynct'
        , target:  'meta-modular/examples/natural2'
        , engine: 'asynct' // how to run the test...
        }
        trial2 = {
          test: 'meta-modular/examples/test/natural.asynct'
        , target:  'meta-modular/examples/natural'
        , engine: 'asynct'
        }
   
      , candidate1 = 'meta-modular/examples/natural'
      , candidate2 = 'meta-modular/examples/natural2'
      , mm = require('meta-modular')('test')

    mm.addTest (trial1)
    mm.addTest (trial2)

    test.equal(mm.tests.get(trial1.test),trial1)
    test.equal(mm.tests.get(trial2.test),trial2)

    mm.addCandidate (candidate1)
    mm.addCandidate (candidate2)

    test.deepEqual(mm.candidates.get(candidate1),{})
    test.deepEqual(mm.candidates.get(candidate2),{})
    
    mm.update(updated)
      
    function updated(status,report){
      var result1 = mm.candidates.get(candidate1)
        , result2 = mm.candidates.get(candidate2)
        , test_result1 = mm.tests.get(trial1.test)
        , test_result2 = mm.tests.get(trial2.test)

      test.ok(result1[trial1.test],'MetaModular.candidates is updated with test results ' + inspect(result1))
      test.ok(result1[trial2.test],'MetaModular.candidates is updated with test results ' + inspect(result1))
      test.ok(result2[trial1.test],'MetaModular.candidates is updated with test results ' + inspect(result2))
      test.ok(result2[trial2.test],'MetaModular.candidates is updated with test results ' + inspect(result2))
        
      test.equal(mm.candidates.get(candidate1)[trial1.test],'failure')
      test.equal(mm.candidates.get(candidate1)[trial2.test],'success')

      test.equal(mm.candidates.get(candidate2)[trial1.test],'success')
      test.equal(mm.candidates.get(candidate2)[trial2.test],'success')
 
       test.equal(test_result1.run[candidate1],'failure')
       test.equal(test_result1.run[candidate2],'success')
       test.equal(test_result2.run[candidate1],'success')
       test.equal(test_result2.run[candidate2],'success')
 
      /*
        NOW what we came here for:
          passes('test') -> passing candidates
      */
      test.deepEqual(mm.passes(trial1.test),[candidate2])
      test.deepEqual(mm.passes(trial2.test),[candidate1,candidate2])
      
      test.finish()    
    }
}
