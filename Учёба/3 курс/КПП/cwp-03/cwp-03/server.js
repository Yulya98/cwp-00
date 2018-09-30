const net = require('net');
const port = 8124;
let fs = require('fs');
let directoriName = './newFolder';
let clientsCount = 0;

let seed = 0;

const server = net.createServer((client) => {
    console.log('Client connected');
    let id =  Date.now() + seed++;
    let text = "";

    client.setEncoding('utf8');


    client.on('error', (err) => {
        console.log(err);
    });

    client.on('data', (data) => {
        text += data;
        if(data.indexOf("connect") != -1){
            if(clientsCount <2) {
                clientsCount++;
                client.write("ภัส");
                text += "ภัส";
            }
            else{
                client.write("DEC");
                text += "DEC";
            }
        }
        else{
            fs.mkdir(directoriName+ "/"+ id,(err, succ) => {
                if(err)
                    throw err;
                else {
                    let index1 = data.indexOf(":") + 1;
                    let diff = data.indexOf("result") - index1;
                    let nameFile = data.substr(index1, diff);
                    let result = data.substring(diff + 7 + index1);
                    fs.open(directoriName + "/" + id + "/" + nameFile, 'wx', (err, fd) => {
                        fs.writeFile(directoriName + "/" + id + "/" + nameFile, result, (err) => {
                            if (err)
                                console.log(err);
                            else {
                                text += "Succes";
                                client.write("Succes");
                            }
                        });
                    });
                }
            });
        }
    });

    client.on('end', () => {
        console.log("create file");
        fs.appendFile('./' + id + '.txt', text, (err) => {
            if (err)
                throw err;
        });
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
});
