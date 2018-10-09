var express = require('express');
var router = express.Router();
var path = require('path');

router.get("/images", function(req, res, next) {
    console.error("A");
    var fs = require('fs');
    console.error("B");
    var request = require('request');
    console.error("C");
    
    let images = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "images.json"), 'utf8'));

    console.error(images);
    console.error("D");

    var imagesMetadata = []
    images.forEach(urlInfo => {
        console.error("E");
        let url = urlInfo.url
        console.error("F");
        request(`http://localhost:80${url}`, function(error, response, body) {
            console.error(response.headers)

            let imageName = response.headers["content-disposition"].split("=")[1]
            console.error(imageName)
            let imageType = response.headers["content-type"].split("/")[1].toUpperCase()
            console.error(imageType)
            let imageSize = Number(response.headers["content-length"]) / 1000
            console.error(imageSize)
            imagesMetadata.push({"name": `${imageName}`, "size": `${imageSize} Kb`, "type": `${imageType}`})
            console.error(imagesMetadata);

            if (imagesMetadata.length == images.length) {
                console.error("H");
                res.json(imagesMetadata)
                console.error("I");
            }
        })
    })
    console.error("G");
});

module.exports = router;