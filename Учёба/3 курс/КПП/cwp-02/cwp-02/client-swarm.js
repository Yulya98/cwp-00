const { spawn } = require('child_process');
let subprocess;

for(let i =0; i<process.argv[2];i++) {
    subprocess = spawn(process.argv[0], ['./client.js'], {
        detached: true,
        stdio: 'ignore'
    });
}

subprocess.unref();