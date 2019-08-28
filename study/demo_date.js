const fs = require('fs');

console.log(new Date().toLocaleString());//【UTC=>本地】默认nodeJS时间比系统少8小时

// fs.writeFileSync(`${getDate()}_log.txt`,'1234','utf8');

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

let LOG_INFO = '';
LOG_INFO  += `${getDate()}\n`;
LOG_INFO  += `${getDate()}\n`;
LOG_INFO  += `${getDate()}\n`;
LOG_INFO  += `${getDate()}\n`;
LOG_INFO  += `${getDate()}\n`;

fs.writeFileSync(`${getDate()}_log.txt`,LOG_INFO,'utf8');
