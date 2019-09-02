const {exec} = require('child_process');
const iconv = require('iconv-lite');

function exec_order(order, info, fn=()=>{}) {
    const timeId = printInfo(info);

    return exec_promise(order).then((stdout, stderr) => {
        const result = iconvDecode(stdout);
        console.log(result);

        // console.log('stdout', stdout);
        // console.log('stderr', stderr);
        fn(stdout,stderr);
        clearInterval(timeId);
    }).catch(err => {
        console.log('err', err);
        clearInterval(timeId);
    });

    function exec_promise(order) {
        return new Promise((resolve, reject) => {
            exec(order,{encoding:'binary'},(err, stdout, stderr) => {
                if (err) return reject(err);
                return resolve(stdout, stderr);
            });
        })
    }

    function printInfo(info) {
        let i = 1;
        return setInterval(() => {
            console.log(info, i++);
        }, 1000);
    }

    function iconvDecode(str = '') {
        const encoding          = 'cp936';
        const binaryEncoding    = 'binary';
        return iconv.decode(Buffer.from(str, binaryEncoding), encoding);
    }
}

exports.exec_order = exec_order;


