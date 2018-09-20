const net = require('net');
const port = 8123;

const client = new net.Socket();
let fs = require('fs');
let array = [];
let index = 0;
client.setEncoding('utf8');

client.connect(port, function() {
    client.write('connect: QA');
    fs.readFile('./qa.json', 'utf-8', function (err, data) {
        let text = JSON.parse(data)
        for(let i = 0;i<text.questions.length;i++) {
            array.push(text.questions[i]);
            array.push(text.answer[i]);
        }
        client.write(array[index]);
    });

});

client.on('data', function(data) {
    if(data === "ACK" || data ==="DEC"){
        console.log(data);
    }
    else {
        if (array.length != 0) {
            if (data === "Yes" || data === "No") {
                if (data === array[index+1] ) {
                    console.log((array[index]));
                    client.write("answer:" + array[index] + ". " + data + ". Right");
                }
                else {
                    console.log((array[index]));
                    client.write("answer:" + array[index] + ". " + data + ". False");
                }
                index += 2;
            }
            else {
                client.write("I don't know this word");
            }
            if (index > 5) {
                client.destroy();
            }
            else {
                client.write(array[index]);
            }
        }
        // client.destroy();
    }
});

client.on('close', function() {
    console.log('Connection closed');
});