const {exec} = require("child_process");

main();

function main() {
    foo1();
}

async function foo1() {
    await exec_order('echo 1');
    console.log(3);
    await exec_order('echo 2');
}

function exec_order(order) {
    return new Promise((resolve,reject)=>{
        exec(order, (err, stdout, stderr) => {
            if(err) {
                reject(err)
            }
            resolve(stdout,stderr)
        });
    }).then((stdout,stderr)=>{
        console.log('stdout',stdout);
        // console.log('stderr',stderr);
    }).catch(err=>{
        console.log('err',err)
    });
}
