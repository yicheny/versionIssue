const execa = require('execa');
main();

async function main() {
    const svnUrl = `https://192.168.1.121:8443/svn/buy_side_web/apps/bs_transfer_agent/ta_frontend`;
    await exec_order(`svn checkout ${svnUrl}`);
    // await exec_order('npm config ls');
    // await exec_order('yarn help');
    console.log(1222)
}
async function exec_order(order) {
    const {stdout} = await execa(order);
    console.log(stdout)
}