//meta-modular
var dirty = require('dirty')
  , EventEmitter = require('events').EventEmitter
  , assert = require('assert')
  , resolve = require('remap/resolve')
  , MultiTest = require('meta-modular/multi_test')
  , easy = require('easyfs')
  , path = require('path')
  , inspect = require('util').inspect
//exports.load = load
MetaModular.prototype = EventEmitter.prototype //new EventEmitter()//;

function MetaModular (name){
  if(!(this instanceof MetaModular)) { return new MetaModular(name) }
  var self = this;

  self.name = name
  self.basepath = process.ENV.HOME + "/.meta-modular/"

  easy.mkdirSync(self.basepath)
    
  self.tests = dirty(name ? self.basepath + 'tests.db' : undefined)
  self.candidates = dirty(name ? self.basepath + 'candidates.db' : undefined)
  self.tests.on('load',function(err){
    
  })
  process.nextTick(function(){
    self.emit('ready',self)
  })
}

MetaModular.prototype.addTest = function (testObj){
  assert.ok('string' === typeof testObj.test)

  this.tests.set(testObj.test,testObj)
}

MetaModular.prototype.addCandidate = function (cand){
  assert.ok('string' === typeof cand)

  this.candidates.set(cand,{})
}

function drop(db,cb){
  db.forEach(function(e){
      db.rm(e)
  })
  cb()
}

MetaModular.prototype.clear = function (callback){
  var self = this
  drop(self.tests,function(){
    drop(self.candidates,callback)
  })
}

MetaModular.prototype.update = function (callback){
  var self = this
    , toUpdate = []
  assert.equal(typeof callback,'function')
  
  self.tests.forEach(function (k,v){
    toUpdate.push(k)
  })
  updateNext() // this is actually a very simple pattern for running an async loop
  function updateNext(status,report){
    if (toUpdate.length == 0)
      return callback()
    var t = toUpdate.pop()
      
    self.update_test(t,updateNext)
  }
}

MetaModular.prototype.update_candidate = function (cand,callback){
  var self = this
    , toUpdate = []
  assert.equal(typeof callback,'function')
  assert.ok(typeof test,'string')
  
  //get candidates with only the correct interface. (LATER!)
  self.tests.forEach(function (k,v){
    toUpdate.push(k)
  })

  updateNext() // this is actually a very simple pattern for running an async loop
  function updateNext(status,report){
    
    if (toUpdate.length == 0)
      return callback()
      
    self.update_pair(toUpdate.pop(),cand,updateNext)
  }
}

MetaModular.prototype.update_test = function (test,callback){
  var self = this
    , toUpdate = []
  assert.equal(typeof callback,'function')
  assert.ok(typeof test,'string')
  
  //get candidates with only the correct interface. (LATER!)
  
  self.candidates.forEach(function (k,v){
    toUpdate.push(k)
  })
  updateNext() // this is actually a very simple pattern for running an async loop
  function updateNext(status,report){
    if (toUpdate.length == 0)
      return callback()
    var t = toUpdate.pop()
      //console.log("   UPDATE CANDIDATE>>>" + inspect(t))
      
    self.update_pair(test,t,updateNext)
  }
}

MetaModular.prototype.update_pair = function (test,cand,callback){
  var self = this;
  assert.equal(typeof callback,'function')
  assert.ok(typeof test,'string')
  assert.ok(typeof cand,'string')
  
  trial = this.tests.get(test)
  trial.candidate = cand
  mt = new MultiTest()
  mt.run(trial,done)
  
  function done(status,report){
    
    var results = self.candidates.get(cand)

    results[test] = report.numFailures == 0 ? 'success' : 'failure'
    self.candidates.set(cand,results)

    var results_test = self.tests.get(test)
    results_test.run = results_test.run || {}
    results_test.run[cand] = report.numFailures == 0 ? 'success' : 'failure'

    self.tests.set(test,results_test)

    callback(status,report)
  }
}

//how could this stuff be improved?


MetaModular.prototype.passes = function (test){
  assert.equal(typeof test,'string', 'expected \'test\ to be a name of a test, but was:' + inspect(test))
  var trial = this.tests.get(test)
    , passes = []
  assert.ok(trial, "there was no test named: " + test)
  assert.ok(trial.run,"expected to have runs of test:" + trial)

  for (candidate in trial.run){
    if(trial.run[candidate] == 'success')
      passes.push(candidate)
  }
  return passes
}

MetaModular.prototype.passedTests = function (candidate){
  assert.equal(typeof candidate,'string', 'expected \'test\ to be a name of a candidate, but was:' + inspect(candidate))
  var runs = this.candidates.get(candidate)
    , passed = []
  assert.ok(trial, "there was no test named: " + test)
  assert.ok(runs,"expected to have runs of candidate, but got:" + runs)

  for (var test in runs){
    if(runs[test] == 'success')
      passed.push(test)
  }
  return passed
}

function searchFiles(project_dir,r){
  var ext = Object.keys(require.extensions)
  files = []

  function searchDir(dirname,list){
    list.forEach(function (e){
      var extension = path.extname(e)
       if (extension === '') {
        try{
          var dirname2 = easy.join(dirname,e)
          searchDir(dirname2,easy.lsSync(path.join(project_dir,dirname2)))
        } catch (err){
          console.log("NOT A DIRECTORY" + inspect(err))
          //wasn't a directory
        }
      } else if(ext.indexOf(extension) !== -1) {
        files.push(path.join('.',dirname,easy.noExt(e)))
      }
    })
  }
  
  searchDir('',easy.lsSync(project_dir))
  return files
}

MetaModular.prototype.add = function (project,r){
  assert.notEqual(project[0],'.',"MetaModular does not currently adding relative projects")
  var self = this
    , file = easy.join(project,'test')
  test = resolve.resolveModuleFilename(file,module, ['.json'])
  if (!test){
    r && r(new Error("could not resolve : " + file))
  }
  easy.load(test[1],c)
  function c (err,obj){
    for (i in obj.tests){
      self.addTest(obj.tests[i])
    }
    var files = searchFiles(path.dirname(test[1]),c)

    files.forEach(function (f){
      var cand = path.join('.',project,f)
      self.addCandidate(cand)
    })

    r && r(err,obj)  
  }
}

module.exports = MetaModular
MetaModular.MetaModular = MetaModular

