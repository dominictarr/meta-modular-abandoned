

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

