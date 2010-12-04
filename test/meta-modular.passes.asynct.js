//check that the target is actually loaded!

//then, lookup datastore in reverse to check find what passes a given test.

//then, expand the syntax for refuring to a test...
  
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

exports ['MetaModular.passes(test) returns list of modules which pass test'] = function (test){
  var mm = MetaModular()
  
  testAddTest(mm,tests.natural,test)
  testAddTest(mm,tests.naturalRandom,test)
  testAddCandidate(mm,candidates.natural,test)
  testAddCandidate(mm,candidates.natural2,test)

  mm.update(c)
  function c (){
  report(mm)
    test.deepEqual(mm.passes(tests.naturalRandom.test),[candidates.natural2])
    test.deepEqual(mm.passes(tests.natural.test).sort(),[candidates.natural,candidates.natural2].sort())
    test.finish()
  }
}

exports ['MetaModular.passedTests(candidate) returns list of tests passed by candidate'] = function (test){
  var mm = MetaModular()
  
  testAddTest(mm,tests.natural,test)
  testAddTest(mm,tests.naturalRandom,test)
  testAddCandidate(mm,candidates.natural,test)
  testAddCandidate(mm,candidates.natural2,test)

  mm.update(c)

  function c(){
  report(mm)


    console.log(mm.passedTests(candidates.natural))
    console.log(mm.passedTests(candidates.natural2))
    test.deepEqual(mm.passedTests(candidates.natural),[tests.natural.test])
    test.deepEqual(mm.passedTests(candidates.natural2).sort(),[tests.natural.test,tests.naturalRandom.test].sort())
    test.finish()
  }
}

function report(mm){
    console.log("PASSED TESTS")
mm.tests.forEach(function (t){
    console.log(
      { test: t
      , passes: mm.passes(t)
      })
  })
}
