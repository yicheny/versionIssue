//操作文件及目录
let fs = require('fs');
let path = require('path');
const {exec} = require('child_process');

//创建目录
// fs.mkdir('new',(err)=>{
//     if(err){
//         console.log(err);
//         return null;
//     }
//     console.log('目录创建成功');
// });

// const url = __dirname+'\\reNew\\child';
const url = __dirname+'\\1235\\.svn';
console.log(url);
// exec_order('svn delete ' + url);
exec_order('rimraf ' + url);
// fs.rmdirSync(url);



//修改文件名称
// fs.rename('new','reNew',()=>{});


// fs.deleteDir();


function exec_order(order) {
    return new Promise(resolve => exec(order,(res)=>resolve(res)));
}