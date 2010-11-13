//make_require

module.exports = {isCalled: isCalled}

function isCalled(test,func,deadline,obj){
  deadline = deadline || 500
  var time = setTimeout(tooLate,deadline)

  return function (){
    clearTimeout(time)
    func.apply(obj,arguments)
  }

  function tooLate(){
    test.ok(false,"expected function " + func + " to have been called within " + deadline + " milliseconds")
  }
}

