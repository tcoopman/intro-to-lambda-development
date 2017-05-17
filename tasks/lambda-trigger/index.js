const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const exec = require('child_process').exec;
const fs = require('fs');
const os = require('os');
const path = require('path');

const filepath = (fileName) => path.join(os.tmpdir(), fileName);

function getFromS3(fileName, bucketName) {
    const params = {
        Bucket: bucketName,
        Key: fileName,
    };

    return new Promise((resolve, reject) => {
        s3.getObject(params, (err, data) => {
            if (err) {
                return reject(err);
            }

            console.log("data resolved");
            return resolve(data);
        });

    })

}

function writeFileToTemp(fileName, body) {
    return new Promise((resolve, reject) => {
        console.log('writing file: ', filepath(fileName));
        fs.writeFile(filepath(fileName), body, (err) => {
            if (err) {
                return reject(err); 
            }
            return resolve(fileName);
        });

    })
}

function convert(fileName) {
    return new Promise((resolve, reject) => {
        console.log('converting file: ', fileName);
        const newFileName = fileName.split(".")[0] + "_thumb.png";
        exec(`convert ${filepath(fileName)} -resize 20% ${filepath(newFileName)}`, (err, stdout, stderror) => {
            if (err) {
                return reject(err);
            }

            resolve(newFileName);
        });
    });
}

function uploadToS3(fileName, bucket) {
    return new Promise((resolve, reject) => {
        s3.upload({
            Bucket: bucket,
            Key: `thumb/${fileName}`,
            Body: fs.createReadStream(filepath(fileName))
        }, function(err, result) {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
}


exports.main = function(eventObject, context, callback) {
    console.log(JSON.stringify(eventObject, null, 4));

    const records = eventObject.Records;
    console.log("records: ", records);
    const fileNames = records.map(record => {
        const fileName = record.s3.object.key;
        const bucketName = record.s3.bucket.name;
        return { fileName, bucketName};
    })

    console.log(JSON.stringify(fileNames, null, 4));


    fileNames.forEach(({fileName, bucketName}) => {
        console.log("executing for ", fileName, bucketName);

        getFromS3(fileName, bucketName)
            .then(data => writeFileToTemp(fileName.split("/")[1], data.Body))
            .then(convert)
            .then(newfilename => uploadToS3(newfilename, bucketName))
            .then(() => {
                console.log("ALL DONE");
            })
            .catch(err => {
                console.log("something failed");
                console.log(err, err.stack);
            });
    });

    callback(null, 'OK');
}