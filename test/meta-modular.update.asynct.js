  //meta-modular.asynct.js
  var MetaModular = require('meta-modular')
    , helper2 = require('async_helper')
    , inspect = require('util').inspect
    , common = require('./lib/common')// meta-modular testing help
    , tests = common.tests
    , candidates = common.candidates
    , passes = common.passes
    , testSuccess = common.testSuccess
    , testFailure = common.testFailure
    , testResult = common.testResult
    , testAddTest = common.testAddTest
    , testAddCandidate = common.testAddCandidate
   // , setup = common.setup //clears MetaModular 'test' datastore
   // , teardown = common.teardown //clears MetaModular 'test' datastore


  exports ['can clear added objects'] = function (test){
    var mm = MetaModular()
      mm.addTest(tests.natural)
      test.deepEqual(mm.tests.get(tests.natural.test),tests.natural)
      mm.clear(cleared)
      function cleared(){    
        test.equal(mm.tests.get(tests.natural.test),undefined)
        test.finish()
      }
  }

  exports ['load a instance of meta-modular'] = function (test){
    var mm = MetaModular()

    test.ok(mm instanceof require('meta-modular'),"require('meta-modular')('test') creates instance of require('meta-modular')")
    test.ok(mm instanceof require('meta-modular').MetaModular,"exports MetaModular type as ")

    test.finish()  
  }

  exports ['add_test and returns correct information about test'] = function (test){
    
    var mm = MetaModular()
    mm.on('ready',helper2.isCalled(isReady))
    function isReady(_mm) {
      testAddTest(mm,tests.natural,test)

      testAddCandidate(mm,candidates.natural,test)
      testAddCandidate(mm,candidates.natural2,test)
      
      test.finish()  
    }
  }

/****/

  exports ['addTest addCandidate then update, to run test!'] = function (test){
      
    var mm = MetaModular()
      , isCalled = helper2.callChecker(20000,test.finish)

    testAddTest (mm,tests.natural,test)

    testAddCandidate (mm,candidates.natural,test)
    testAddCandidate (mm,candidates.natural2,test)

    mm.update_pair(tests.natural.test
      ,candidates.natural,isCalled(updated1))


    mm.update_pair(tests.natural.test
      ,candidates.natural2,isCalled(updated2_1))

    function updated1(status,report){
      console.log('\nupdated1\n\n',inspect(report))
      console.log('\nupdated1\n\n',inspect(mm.candidates.get(report.candidate)))

      test.equal(report.test,tests.natural.test)
      test.equal(report.candidate,candidates.natural)
      testSuccess(mm,tests.natural,candidates.natural,test)
    }

    function updated2_1(status,report){
      console.log('updated2_1',status)

      test.equal(report.test,tests.natural.test)
      test.equal(report.candidate,candidates.natural2)

      testSuccess(mm,tests.natural,candidates.natural2,test)
    }
  }

/****/

  exports ['addTest addCandidate then update, to run test, with a failing test!'] = function (test){
    
    var mm = MetaModular()
      , isCalled = helper2.callChecker(20000,test.finish)

    testAddTest(mm,tests.naturalRandom,test)

    testAddCandidate (mm,candidates.natural,test)
    testAddCandidate (mm,candidates.natural2,test)

    mm.update_pair(tests.naturalRandom.test
      ,candidates.natural,isCalled(updated1))
      
    mm.update_pair(tests.naturalRandom.test
      ,candidates.natural2,isCalled(updated2_2))
      
    function updated1(status,report){
      testFailure(mm,tests.naturalRandom
        ,candidates.natural,test)
    }
    function updated2_2(status,report){
      testSuccess(mm,tests.naturalRandom
        ,candidates.natural2,test)
    }
  }


  exports['can update multiple candiadtes at once'] = function (test){
    var mm = MetaModular()

    testAddTest (mm,tests.naturalRandom,test)

    testAddCandidate (mm,candidates.natural,test)
    testAddCandidate (mm,candidates.natural2,test)
    
    mm.update_test(tests.naturalRandom.test,updated)
      
    function updated(status,report){
      testFailure(mm,tests.naturalRandom
        ,candidates.natural,test)
      testSuccess(mm,tests.naturalRandom
        ,candidates.natural2,test)
      
      test.finish()    
    }
  }

  exports['can update multiple tests at once'] = function (test){
    var mm = MetaModular()

    testAddTest (mm,tests.naturalRandom,test)
    testAddTest (mm,tests.natural,test)

    testAddCandidate (mm,candidates.natural,test)
    
    mm.update_candidate(candidates.natural,updated)
      
    function updated(status,report){
      testFailure(mm,tests.naturalRandom
        ,candidates.natural,test)
      testSuccess(mm,tests.natural
        ,candidates.natural,test)
      
      test.finish()    
    }
  }
  
  exports['can update everything at once'] = function (test){
    var mm = MetaModular()

    testAddTest(mm,tests.naturalRandom,test)
    testAddTest(mm,tests.natural,test)

    testAddCandidate (mm,candidates.natural,test)
    testAddCandidate (mm,candidates.natural2,test)

    mm.update(updated)
      
    function updated(status,report){
      
      testSuccess(mm,tests.natural
        ,candidates.natural,test)
      testSuccess(mm,tests.natural
        ,candidates.natural2,test)

      testFailure(mm,tests.naturalRandom
        ,candidates.natural,test)
      testSuccess(mm,tests.naturalRandom
        ,candidates.natural2,test)

      test.finish()    
    }
  }
  /**/
//module.exports = require('async_testing').wrap({setup: setup,teardown:teardown,suite: exports})

