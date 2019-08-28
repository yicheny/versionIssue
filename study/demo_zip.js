const fs = require('fs');
const archiver = require('archiver');

const output = fs.createWriteStream(__dirname + '/reNew.zip');

const archive = archiver('zip',{
    zlib:{
        level:9
    }
});

archive.pipe(output);
const url = __dirname + '/reNew/';
archive.directory(url,'reNew');
// archive.directory(url,false);//false表示文件放在根目录
archive.finalize();