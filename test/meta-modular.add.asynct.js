  /*
    specify test targets in file, and pick them up automaticially...
        (resolve, then look for test.json
          then, when you say > meta-modular test dominictarr/remap/test/remap.asynct
          if finds the test and knows what the target is.
          you chould shorten it to dominictarr/remap
          since the test is certainly in the test folder.
          however, you may want to refur to a specific test.        
        )

    this is a high level command invoked when someone adds a project,
    
    so they'll invoke something like
    > meta-modular add tests project_dir
    
    it will then look in project_dir for test.json or test/test.json
    
    and then add all the tests

    MetaModular.add(project_dir)
    
    adds a whole project.
      a project has tests and or modules.
      MetaModular.add will search for files describing the tests
      
      
    if i indexed tests by thier key in the test.json file rather than thier 
    file name, you could define multiple targets for the same file, and use 
    the test for several different thing 
       (although that is too complicated to go after right now)
  */

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
  exports ['MetaModular.add(project_dir) adds all test files'] = function(test){

    var mm = MetaModular()//in memory datastore

    mm.add('meta-modular/examples',c)
    
    function c(err,testJson){
      test.ifError(err)
      test.equal(testJson.author,'dominictarr')
      test.equal(testJson.name,'meta-modular/examples')
      test.deepEqual(testJson.tests.natural,tests.natural)
      test.deepEqual(testJson.tests.naturalRandom,tests.naturalRandom)
      // and this stuff should be in the tests
      
      test.deepEqual(mm.tests.get(tests.natural.test),testJson.tests.natural)
      test.deepEqual(mm.tests.get(tests.naturalRandom.test),testJson.tests.naturalRandom)

      test.deepEqual(mm.candidates.get(candidates.natural),{})
      test.deepEqual(mm.candidates.get(candidates.natural2),{})

      mm.update(c)
      function c(err,report){
        test.ifError(err)
        
        test.deepEqual(mm.passedTests(candidates.natural),[tests.natural.test])
        test.deepEqual(mm.passedTests(candidates.natural2).sort()
          ,[tests.natural.test,tests.naturalRandom.test].sort())

        test.finish()    
      }
    }
  }

