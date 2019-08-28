const readline = require('readline');
const fs = require('fs');
const {exec} = require('child_process');
const archiver = require('archiver');

//发布需要使用的信息
const INFOS = {
    project:'AB',
    version:'1.1.1.1',
    revision:'latest',
};
const PROJEFT_SVN = {
    AA:`https://github.com/yicheny/webStrategy.git`,
    AB:`https://github.com/yicheny/tree_table.git`,
};

main();

async function main() {
    await getInfos();
    await pullSvn();
    await mkVerison();
    await commitSvn();
    await buildDir();
    process.exit();
}


//通过使用者输入获取信息
async function getInfos() {
    INFOS.project = await question('请输入本次发布的项目名称：');
    console.log('项目名称：' + INFOS.project);
    INFOS.version = await question('请输入本次发布的版本号：');
    console.log('版本号：' + INFOS.version);
    const checkFlag = await question('请问信息是否确认无误？(Y/N)');
    return checkInfo(checkFlag);

    function question(query) {
        const rl = rlFor();
        return new Promise(resolve => rl.question(query, (answer) => resolve(answer)));

        function rlFor() {
            return readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
        }
    }
}

//拉取pullSvn最新版本至本地
function pullSvn() {
    const url = PROJEFT_SVN[INFOS.project];
    if (!url) {
        console.log('没有这个项目或项目名称有误，请重新输入信息...');
        return getInfos();
    }
    return projectFor(url)();

    function projectFor(url) {
        return async () => await exec_order(`git clone ${url}`, '拉取最新代码中...');
    }
}

//使用获取的版本号为拉取的文件夹重命名
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

    function getProjectName(key) {
        const projectNameMap = {
            'AA': 'webStrategy',
            'AB': 'tree_table',
        };
        return projectNameMap[key]
    }
}

function checkInfo(flag) {
    if (['y', 'Y'].includes(flag)) return console.log('信息已确认，即将拉取代码到本地...');
    console.log('请重新输入信息');
    return getInfos();
}

async function commitSvn() {
    await exec_order(`git add ${INFOS.version}/`, '添加文件中...');
    await exec_order(`git commit -m "脚本测试中3"`, '提交文件中...');
}

async function buildDir() {
    process.chdir(`./${INFOS.version}`);
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
        // console.log('stderr',stderr);
        clearInterval(timeId)
    }).catch(err => {
        console.log('err', err);
        clearInterval(timeId)
    });
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