let readline = require('readline');
let fs = require('fs');
const {exec} = require('child_process');

//发布需要使用的信息
const INFOS = {
    project:null,
    version:null
};

main();

async function main() {
    await getInfos();
    await pullSvn();
    mkVerison();
    await commitSvn();
    process.exit();
}
function question (query) {
    return new Promise(resolve => rlFor().question(query, (answer) => resolve(answer)));
}
function rlFor(){
    return readline.createInterface({
        input:process.stdin,
        output:process.stdout
    });
}
async function getInfos(){
    INFOS.project = await question('请输入本次发布的项目名称：');
    console.log('项目名称：'+ INFOS.project);
    INFOS.version = await question('请输入本次发布的版本号：');
    console.log('版本号：'+ INFOS.version);
    const checkFlag = await question('请问信息是否确认无误？(Y/N)');
    return checkInfo(checkFlag);
    // process.exit();
}
//拉取pullSvn最新版本至本地
function pullSvn() {
    if (!projectFor(INFOS.project)) {
        console.log('该项目不存在,请重新输入');
        return getInfos();
    }
    return projectFor(INFOS.project)();

    function projectFor(key) {
        const projectMap = {
            TA:async ()=>{
                const svnUrl = `https://192.168.1.121:8443/svn/buy_side_web/apps/bs_transfer_agent/ta_frontend`;
                await exec_order(`svn checkout ${svnUrl}`)
            }
        };

        return projectMap[key]
    }
}

//使用获取的版本号为拉取的文件夹重命名
function mkVerison(){
    console.log('使用获取的版本号为拉取的文件夹重命名...');
    const {project,version} = INFOS;
    fs.rename(getProjectName(project),version,async(err)=>{
        if(err){
            console.log('创建本地发布版本失败：' + err)
        }
        console.log('创建本地发布版本成功');
        const url = __dirname + `\\${version}\\.svn`;
        await exec_order('rimraf ' + url);
        console.log('删除.svn文件');
    });

    function getProjectName(key) {
        const projectNameMap = {
            'TA':'ta_frontend'
        };
        return projectNameMap[key]
    }
}
function checkInfo(flag) {
    if(flag.toUpperCase() === 'Y') return console.log('信息确认无误，拉取最新版本到本地...');
    console.log('请重新输入信息');
    return getInfos();
}
function exec_order(order) {
    return new Promise(resolve => exec(order,(res)=>resolve(res)));
}
async function commitSvn() {
    console.log('添加文件中...');
    await exec_order(`svn add ${INFOS.version}`);
    console.log('提交文件中...');
    await exec_order(`svn commit -m "提交描述"`);
}

//node cmd_Issue