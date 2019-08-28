//
const {exec} = require('child_process');

main();

async function main() {
    // const gitUrl = 'https://github.com/yicheny/webStrategy.git';
    // await exec_order(`git clone ${gitUrl}`);
    await exec_order('npm config ls');
    await exec_order('yarn help');
    console.log(1222)
}

// exec_order('npm config ls');

// const gitUrl = 'https://github.com/yicheny/webStrategy.git';
// exec_order(`git clone ${gitUrl}`);

// const svnUrl = `https://192.168.1.121:8443/svn/buy_side_web/apps/bs_transfer_agent/ta_frontend`;
// exec_order(`svn checkout ${svnUrl}`);


function question (query) {
    return new Promise(resolve => rlFor().question(query, (answer) => resolve(answer)));
}

function exec_order(order) {
    /*return exec(order, (err, stdout, stderr) => {
        if(err) {
            console.log('err',err);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });*/
    return new Promise(resolve => exec(order,(res)=>resolve(res)));
}