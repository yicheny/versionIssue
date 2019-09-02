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

//删除目录
// const url = __dirname+'\\reNew\\child';
// const url = __dirname+'\\1235\\.svn';
// console.log(url);
// exec_order('rimraf ' + url);
// fs.rmdirSync(url);

//修改文件名称
// fs.rename('new','reNew',()=>{});

//读取文件
// fs.readFile('Setting.json','utf8',(err,data)=>{
//     if(err){
//         return console.log(err);
//     }
//     console.log(JSON.parse(data));
// });

//写入文件
// fs.writeFileSync('写入测试.text','abcd','utf8');
// fs.writeFileSync('写入测试.text','中文内容测试','utf8');

//读取目录
// console.log(fs.readdirSync(__dirname));

const url = __dirname + '\\1.0';
console.log(url);
fs.rmdir(url,()=>{});

function exec_order(order) {
    return new Promise(resolve => exec(order,(res)=>resolve(res)));
}