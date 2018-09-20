const net = require('net');
const port = 8123;
let fs = require('fs');

let seed = 0;

const server = net.createServer((client) => {
    console.log('Client connected');
    let id =  Date.now() + seed++;
    let text = "";

    client.setEncoding('utf8');


    client.on('error', (err) => {
        client.write('DEC');
    });

    client.on('data', (data) => {
        if(data.search("connect:") === 1){
            client.write("ACK");
            text +=data +"\n";
            // fs.appendFile('./'+id+'.txt',data + " \n",(err) => {
            //     if (err)
            //         throw err;
            // });
        }
        else {
            console.log(data);
            text +=data +"\n";
            // fs.appendFile('./'+id+'.txt',data+ " \n",(err) => {
            //     if (err)
            //         throw err;
            // });
            if (data.search("answer:") === -1) {
                var rand = Math.random() * 2;
                rand = Math.floor(rand);
                if (rand === 1) {
                    client.write("Yes");
                }
                else {
                    client.write("No");
                }
            }
        }
    });

    client.on('end', () =>{
        fs.appendFile('./'+id+'.txt',text,(err) => {
            if (err)
                throw err;
        })
        console.log('Client disconnected')});
});

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
});