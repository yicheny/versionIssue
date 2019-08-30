let INFOS = null;
let PROJECT_URL = null;
let LOG_INFO = '';
let WEB_URL = null;

let fs = require('fs');
const {exec} = require('child_process');
const archiver = require('archiver');

main();

async function main() {
    await getInfos();
    await pullSvn();
    await mkVerison();
    await commitSvn();
    process.chdir(`./${INFOS.version}`);
    await buildDir();
    await upload();
    createLog();
    process.exit();
}
function getInfos() {
    return new Promise((resolve,reject)=>fs.readFile('Setting.json','utf8',(err,data)=>{
        if(err) reject(err);
        resolve(data)
    })).then(data=>{
        data = JSON.parse(data);
        INFOS = data.info;
        PROJECT_URL = data.project_url;
        WEB_URL = data.web_url;
    }).catch(err=>{
        console.error('err',err);
    })
}
function pullSvn() {
    const url = PROJECT_URL[INFOS.project];
    isExist() && delVersion()();
    if (!url) return console.log(('没有这个项目或项目名称有误，请重新配置信息...'));
    return projectFor(url)();

    function projectFor() {
        if(INFOS.revision === 'latest')return async () =>  await exec_order(`svn export ${url}`,'拉取最新代码中...');
        return async ()=> await exec_order(`svn export -r ${INFOS.revision} ${url}`,'拉取指定版本代码中...')
    }
    function isExist(){
        const dirList = fs.readdirSync(__dirname);
        return dirList.includes(INFOS.version);
    }
    function delVersion() {
        const url = (__dirname + `\\${INFOS.version}`);
        console.log(`${INFOS.version}已存在，删除旧有目录...`);
        return async ()=> await exec_order('echo Y|rd /S ' + url);
    }
}
function mkVerison(){
    console.log('使用获取的版本号为拉取的文件夹重命名...');
    const {project,version} = INFOS;
    return new Promise((resolve,reject)=>{
        fs.rename(getProjectName(project),version,(err)=>{
            if(err){
                reject(err)
            }
            resolve()
        })
    }).then(async()=>{
        console.log('创建本地发布版本成功');
    }).catch(err=>{
        return console.log('创建本地发布版本失败：' + err)
    });

    function getProjectName(key) {
        console.log(PROJECT_URL[INFOS.project].split('/').pop());
        return PROJECT_URL[INFOS.project].split('/').pop();
    }
}
async function commitSvn() {
    await exec_order(`svn add ${INFOS.version}/`,'添加文件中...');
    await exec_order(`svn commit -m ${INFOS.describe}`,'提交文件中...');
}
async function buildDir() {
    await exec_order(`yarn install`,'下载依赖中...');
    await exec_order(`yarn build`,'build打包中...');
    await zip();

    async function zip() {
        const output = fs.createWriteStream(`${__dirname}/${INFOS.version}/build.zip`);
        const archive = archiver('zip',{zlib:{level:9}});
        archive.pipe(output);
        const url = `${__dirname}/${INFOS.version}/build/`;
        archive.directory(url,'build');
        console.log('build包压缩中...');
        await archive.finalize()
    }
}
async function upload() {
    if(!INFOS.isUpload) return;
    await exec_order(`copy build.zip ${WEB_URL[INFOS.project]}\\web_temp`,'build.zip发送到线上环境中...');
    await exec_order(`copy readme.txt ${WEB_URL[INFOS.project]}\\web_temp`,'readme.txt发送到线上环境中...');
}
function createLog() {
    fs.writeFileSync(getFileName(),LOG_INFO,'utf8');

    function getFileName(){
        return `${INFOS.project}${getDate()}_log.txt`;

        function getDate() {
            const date = new Date();
            const year = format(date.getFullYear());
            const month= format(date.getMonth());
            const day = format(date.getDate());
            const hour = format(date.getHours());
            const min = format(date.getMinutes());
            const sec = format(date.getSeconds());

            return year + month + day + hour + min + sec;

            function format(value) {
                if(value<10) return '0'+value;
                return value;
            }
        }
    }
}
function exec_order(order,info) {
    let i = 1;
    const timeId = setInterval(()=>{
        console.log(info,i++);
    },1000);

    return new Promise((resolve,reject)=>{
        exec(order, (err, stdout, stderr) => {
            if(err) return reject(err);
            return resolve(stdout,stderr);
        });
    }).then((stdout,stderr)=>{
        console.log('stdout',stdout);
        // console.log('stderr',stderr);
        LOG_INFO += `stdout:${stdout}\n`;
        // LOG_INFO += `stderr:${stderr}\n`;
        clearInterval(timeId);
    }).catch(err=>{
        console.log('err',err);
        LOG_INFO += `err:${err}\n`;
        clearInterval(timeId);
    });
}
