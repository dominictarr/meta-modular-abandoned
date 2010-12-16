//files
var traverse = require('traverser')
  , easy = require('easyfs')
  , log = require('logger')
  , path = require('path')
  , async = require('traverser/iterators').async
  , fs = require('fs')
/*
function lsR (path,done){
  easy.ls('.',c)
  function c(err,ls){
    async.map(ls,map,done)
    
    function map(file,next){
      
    }
  }
}*/
easy.lsSync('.')

/*function c(err,ls){
  log(ls)
  ls.forEach(function (f){
  
    
  
  })
}*/


/*
function lsRSync(path){
  var ls = easy.lsSync(path)
  ls.map(function (e){
        try{
          var dirname2 = easy.join(dirname,e)
          return searchDir(dirname2,easy.lsSync(path.join(project_dir,dirname2)))
        } catch (err){
          //console.log("NOT A DIRECTORY" + inspect(err))
          //wasn't a directory
        }

  })
}

*/


function searchFiles(project_dir,r){
  var ext = Object.keys(require.extensions)
  files = []

  function searchDir(dirname,list){
    list.forEach(function (e){
      var extension = path.extname(e)
       if (extension === '' && e[0] !== '.') {//ignore hidden file
        try{
          var dirname2 = easy.join(dirname,e)
          searchDir(dirname2,easy.lsSync(path.join(project_dir,dirname2)))
        } catch (err){
          //console.log("NOT A DIRECTORY" + inspect(err))
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



log(searchFiles('meta-modular'))


fs.watchFile('./traverser/test',onChange,1000)
function onChange(after,before){
  log('before:','' + before.mtime)
  log('after:','' + after.mtime)
}
