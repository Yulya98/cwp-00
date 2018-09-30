const net = require('net');
const paths = require('path');
const port = 8124;

const client = new net.Socket();
let fs = require('fs');
client.setEncoding('utf8');

client.connect(port, function() {
    client.write('connect: FILES');
});

client.on('data', function(data) {
    console.log(data);
    if(data === "ภัส"){
        readFiles();
    }
    else{
        if(data === "DEC"){
            client.destroy();
        }
    }
    if(data === "Succes"){
        client.destroy();
    }
});

client.on('close', function() {
    console.log('Connection closed');
});

let readFiles = function() {
    for(let index = 2; index < process.argv.length;index++) {
        createScript(process.argv[index], function (filePath, stat) {
            for (let i = 0; i < stat.length; i++) {
                fs.readFile(stat[i], "utf-8", (err, res) => {
                    try {
                        if (err)
                            throw err;
                        let nameFile = paths.basename(stat[i]);
                        client.write("File name: " + nameFile + "result:" + res);
                    }
                    catch (e) {
                        console.log(e);
                    }
                });
            }
        });
    }
};

let createScript = function( path, callback){
    if( typeof callback !== 'function' )
        return ;
    let result = [], files = [ path.replace( /\/\s*$/, '' ) ];
    function traverseFiles (){
        if( files.length ) {
            let name = files.shift();
            fs.stat(name, function( err, stats){
                if( err ){

                    if( err.errno == 34 )
                        traverseFiles();
                    else callback(err)
                }
                else if ( stats.isDirectory())
                    fs.readdir( name, function( err, files2 ){
                        if( err )
                            callback(err)
                        else {
                            files = files2
                                .map( function( file ){ return name + '/' + file } )
                                .concat( files )
                            traverseFiles()
                        }
                    });
                else{
                    result.push(name);
                    traverseFiles()
                }
            })
        }
        else callback( null, result )
    }
    traverseFiles()
};