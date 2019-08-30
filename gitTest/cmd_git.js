let INFOS = null;
let PROJECT_URL = null;
let LOG_INFO = '';

const fs = require('fs');
const {exec} = require('child_process');
const archiver = require('archiver');

main();

async function main() {
    await getInfos();
    await pullSvn();
    await mkVerison();
    // await commitSvn();
    process.chdir(`./${INFOS.version}`);
    // await buildDir();
    createLog();
    process.exit();
}

function getInfos() {
    return new Promise((resolve,reject)=>fs.readFile('Setting.json','utf8',(err,data)=>{
        if(err) reject(err);
        resolve(data)
    })).then(data=>{
        data = JSON.parse(data);
        INFOS = data.setting;
        PROJECT_URL = data.project_url;
    }).catch(err=>{
        console.error('err',err);
    })
}

function pullSvn() {
    const url = PROJECT_URL[INFOS.project];
    if (!url) return console.log(('没有这个项目或项目名称有误，请重新配置信息...'));
    return projectFor(url)();

    function projectFor(url) {
        return async () => await exec_order(`git clone ${url}`, '拉取最新代码中...');
    }
}

function mkVerison() {
    console.log('使用获取的版本号为拉取的文件夹重命名...');
    const {project, version} = INFOS;
    return new Promise((resolve, reject) => {
        fs.rename(getProjectName(project), version, (err) => {
            if (err) {
                reject(err)
            }
            resolve()
        })
    }).then(async () => {
        console.log('创建本地发布版本成功');
        const url = (__dirname + `\\${INFOS.version}\\.git`);
        await exec_order('echo Y|rd /S ' + url);
        console.log('删除.git文件');
    }).catch(err => {
        return console.log('创建本地发布版本失败：' + err)
    });

    function getProjectName() {
        return PROJECT_URL[INFOS.project].split('.git')[0].split('/').pop();
    }
}

async function commitSvn() {
    await exec_order(`git add ${INFOS.version}/`, '添加文件中...');
    await exec_order(`git commit -m "脚本测试中3"`, '提交文件中...');
}

async function buildDir() {
    await exec_order(`yarn install`, '下载依赖中...');
    await exec_order(`yarn build`, 'build打包中...');
    await zip();

    async function zip() {
        const output = fs.createWriteStream(`${__dirname}/${INFOS.version}/build.zip`);
        const archive = archiver('zip', {zlib: {level: 9}});
        archive.pipe(output);
        const url = `${__dirname}/${INFOS.version}/build/`;
        archive.directory(url, 'build');
        console.log('build包压缩中...');
        await archive.finalize()
    }
}

function exec_order(order, info = '') {
    let i = 1;
    const timeId = setInterval(() => {
        console.log(info, i++);
    }, 1000);

    return new Promise((resolve, reject) => {
        exec(order, (err, stdout, stderr) => {
            if (err) return reject(err);
            return resolve(stdout, stderr);
        });
    }).then((stdout, stderr) => {
        console.log('stdout', stdout);
        console.log('stderr',stderr);
        LOG_INFO += `stdout:${stdout}\n`;
        LOG_INFO += `stderr:${stderr}\n`;
        clearInterval(timeId)
    }).catch(err => {
        console.log('err', err);
        LOG_INFO += `err:${err}\n`;
        clearInterval(timeId)
    });
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

/*class TimeInfo{
    constructor(info,speed=1000){
        this.timeIndex = 1;
        this.timeId = null;
        this.info = '';
        this.speed = speed;
    }

    executor = ()=>{
        this.timeId = setInterval(()=>{
            console.log(this.info,this.timeIndex++)
        },this.speed)
    };

    clear = ()=>{
        clearInterval(this.timeId)
    }
}*/