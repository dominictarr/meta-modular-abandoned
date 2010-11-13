//meta-modular
var dirty = require('dirty')
  , EventEmitter = require('events').EventEmitter
  , assert = require('assert')
  , MultiTest = require('meta-modular/multi_test')
  , easy = require('easyfs')
  , inspect = require('util').inspect
//exports.load = load
MetaModular.prototype = EventEmitter.prototype //new EventEmitter()//;

function MetaModular (name){
  if(!(this instanceof MetaModular)) { return new MetaModular(name) }
  var self = this;

    self.name = name || '.'
    self.basepath = process.ENV.HOME + "/.meta-modular/"
    //fs.mkdirSync(self.path,666)
    easy.ensureDirSync(self.basepath)
    
//    fs.mkdirSync(self.path)
  self.tests = dirty(self.basepath + 'tests.db')
  self.candidates = dirty(self.basepath + 'candidates.db')
  self.tests.on('load',function(err){
    
  })
  process.nextTick(function(){
    self.emit('ready',self)
  })
  
//  return this
}

MetaModular.prototype.addTest = function (testObj){
  assert.ok('string' === typeof testObj.test)

  this.tests.set(testObj.test,testObj)
}

MetaModular.prototype.addCandidate = function (cand){
  assert.ok('string' === typeof cand)

  this.candidates.set(cand,{})
}

function drop(db){
  db.forEach(function(e){
      db.rm(e)
  })
}

MetaModular.prototype.clear = function (callback){
  var self = this
  drop(self.tests)
  drop(self.candidates)
  easy.rm(self.tests.path,callback)
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
    //console.log("   UPDATE:" + t)
      
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
    //console.log(k)
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
    //save results.
    
    var results = self.candidates.get(cand)
    results[test] = report.numFailures == 0 ? 'success' : 'failure'
    //console.log(results)
    self.candidates.set(cand,results)

    var results_test = self.tests.get(test)
    results_test.run = results_test.run || {}
    results_test.run[cand] = report.numFailures == 0 ? 'success' : 'failure'

    self.tests.set(test,results_test)

    callback(status,report)
  }
}

MetaModular.prototype.passes = function (test){
  assert.ok('string' === typeof test)

  this.tests.get(test).run.forEach(function (e){
      
  })
}

module.exports = MetaModular
MetaModular.MetaModular = MetaModular

