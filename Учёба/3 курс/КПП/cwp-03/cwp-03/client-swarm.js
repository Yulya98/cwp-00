const child  = require('child_process');

for(let i =0; i<process.argv[2];i++) {
    child.exec('node client-files.js ./myFolder' , (error, stdout, stderr) => {
        console.log(error);
        console.log(stderr);
        console.log(stdout);
    });
}
