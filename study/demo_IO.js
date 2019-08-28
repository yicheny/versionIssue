//获取用户输入


var readline = require('readline');

var  rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

//回调写法
// rl.question("请输入本次发布的项目名称：",answer=>{
//     console.log('项目名称：'+answer);
//     rl.question('请输入本次发布的版本号:',(res)=>{
//         console.log('版本号：'+res);
//         rl.close()
//     })
// });

const question = (query) => new Promise(resolve => rl.question(query, (answer) => resolve(answer)));
(async ()=>{
    let projectName = await question('请输入本次发布的项目名称：');
    console.log('项目名称：'+projectName);
    let version = await question('请输入本次发布的版本号：');
    console.log('版本号：'+version);
    rl.close();
})();

rl.on("close", function(){
    process.exit(0);
});
