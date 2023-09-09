
const { PutObjectCommand, DeleteObjectCommand, S3Client } = require("@aws-sdk/client-s3")
const { parseUrl } = require("@aws-sdk/url-parser");

const client = new S3Client({});

module.exports = new class {
    constructor() {
        const { AWS_BUCKET: bucket, AWS_REGION: region } = process.env;

        this.URL = (Key) => {
            let convertURL = parseUrl(`https://${bucket}.s3.${region}.amazonaws.com/${Key}`)
            return `${convertURL.protocol}//${convertURL.hostname}${convertURL.path}`
        }
    }

    insert(file) {
        return new Promise((resolve, reject) => {
            const cmd = new PutObjectCommand({
                ACL: 'public-read',
                Bucket: process.env.AWS_BUCKET,
                Key: file.filename,
                Body: file.buffer,
                ContentType: file.mimetype,
            });
    
            client.send(cmd)
                .then(() => {
                    const response = {
                        name: file.originalname,
                        size: file.size,
                        key: file.filename,
                        url: this.URL(cmd.input.Key)
                    };
    
                    resolve(response);
                })
                .catch((err) => {
                    console.error(err);
                    reject("Não foi possível fazer upload da imagem");
                });
        });
    }
    delete (key) {
        return new Promise((resolve, reject) => {
            const cmd = { Bucket: process.env.AWS_BUCKET, Key: key }
            client.send(new DeleteObjectCommand(cmd))
                .then(e => { resolve(e) })
                .catch(err => { reject(err) })
        })
        
    }
}