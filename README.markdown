
okay? I can:

add tests
add candidates
update (run tests)

get passing modules (for a test)
get tests passed (for a module)

load tests specified in test.json
file all the .js files in a project.

whats next?:

1. test runners, so i can run multiple types of tests.
2. wrap git, so i can download everyone's projects, 
   and setup meta-modular to have it's own directory.
3. read up on open source licences.
4. detect interface and don't test modules which couldn't possibly work.
5. command line tool and reporting.
6. web interface. HA!

so far I just have some very trivial tests, 
I think the next thing has got to be see how far it can be stretched.

for that ill need some sort of reporting... at first i can run it in the repl.


~~~~
OKAY. so the next thing is adding all of my stuff... and seeing if anything breaks. 2:57 AM, Nov 16 2010

... yes! test runners need to be more robust!

~~~~




okay, 19 days until javascript meetup.

what is needed for a rudementary prototype?

1. run/load a module by saying what test it should pass.

2. update test->modules record (run (all/specified) tests against all modules)

3. handle git modules... (not essential, but would be ++ cool)

...

okay, so what would this involve?

> meta-modular passes dominictarr/remap/test
...load test data store
...lookup dominictarr/remap/test (this would refur to a set of tests...)
...get best implementation which passes 'test'
...run (which could have it's own specifications about what must pass what)

>meta-modular update dominictarr/remap/test
...for each test in dominictarr/remap/test
.....for each candidate in candidate list
.......trial candidate at test, write result to datastore

okay, tricky part here is only really how i'm gonna parse

so, a map of test -> implementaion.js, results

list of candidates 
  < {
    or even better
    list of interfaces (map of properties -> list of implementors)
    and test -> property list
      (map test -> propertys -> (intersection of) implementors
    }

so first task, is given a test, get candidates, 
stick candidates into test.target and run test.
record results into test result datastore.

then, when there is a request something that passes, 
look in test result datastore for best result. and then run it!



sounds easy enough!

okay, so first thing is probably the test.json ... 
{ author: you
, package: snappy_name
, repo: github.com (or gist.github.com)
, version: 234239579235 (tag or git commit... because tests are static)
, test_dir: test (guess at test, tests, spec, specs)
, url: github.com/you/snappy_name (repo/author/package)

, engine: [test_framework_name]
, tests: [
  { file: 'snappy.test.js'
  , target: 'snappy' //the request which is loaded inside snappy.test.js
  }]
}
    
THATS ENOUGH!

so whats the smallest test?

test.json file, a test, a candidate, run it.

CHECK WHETHER CANDIDATE IS LOADED. (for example, if the target is not correct)

mm.load('test')
mm.clear('test')//clear test datastore.

mm.addTest (test.json)
mm.addCandidate (implementation.js)

mm.update ('testname') // finds the test and tries it against each module.
mm.update ('implementation') // finds the test and tries it against each module.
mm.update ('testname','implementation') run implementation through testname



idea: update resolve so that it automaticially checks for lib
so a request for xyz finds
$PATH/xyz
but not $PATH/xyz/index.js
it checks for
$PATH/xyz/lib/xzy.js

make it handle the first dir as the package name so it will go
for xyz/foo to xyz/lib/xzy/foo.js



  i need a helper to query this stuff.
  say things like
  in tests:
  { value : {run : {'*' : 'success'}}} 
  
  //returns all tests which have a success, and thier passing candidates
  //accept * string and regular expressions as the key.

  { key: function whatever (){...}}

  returns all objects which whatever(obj) returns true for.
  put multiple keys in an map to AND them
  
  { value: {*:'failure'}
  , key: /dominictarr\/.+/  
  }
  
  this would return all the failures in modules that where written by me.
  
  is this too clever?
  
  what is the most important thing to do next?
  
  EAT!
  
  okay. done that now. whats next most important things?
  
  check whether test target is actually loaded. - done. WAAZ EASY
      get dependencies for module - call back after something loads...
      oh wait, it's easy. just parse the module cache.
      could make a custom load that callsback too. (easier)

  test runner with plugable runners (script,asynct,expresso,vows,jasmine,jspec)

  specify test targets in file, and pick them up automaticially...
      (resolve, then look for test.json
        then, when you say > meta-modular test dominictarr/remap/test/remap.asynct
        if finds the test and knows what the target is.
        you chould shorten it to dominictarr/remap
        since the test is certainly in the test folder.
        however, you may want to refur to a specific test.        
      )
  specify dependencies in package.json or depends.json 
  or load them directly in the file 

  so, TODO MONDAY: implement stuff for test.json and depends.json.

  (this would add meta-modular as a dependency, 
    and since the project should run as it stands, thats a bit heavy)

  wrap git, and automaticially pull

  typesafe module

  object query

  command to run a module

  > meta-modular passes 'test'

