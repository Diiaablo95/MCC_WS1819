const express = require("express")
const router = express.Router()
const path = require("path")
const latexCompiler = require('node-latex')
const fs = require('fs')

const download = require('download-file')

router.get("/", (req, res, next) => {
    const resourceURL = req.query.url

    if(!resourceURL) {
        res.statusCode = 400
        res.send({status: "failure"})
        return
    }

    const directoryPath = path.join(__dirname, '..', 'files')

    download(resourceURL, {directory: directoryPath, filename: "sample.tex"}, (error) => {
        if (error) {
            console.error(error)
            res.statusCode = 400
            res.send({status: "failure"})
            return
        }

        console.log("A")
        console.log(path.join(directoryPath, "sample.tex"))
        const textFileInputPath = fs.createReadStream(path.join(directoryPath, "sample.tex"))
        console.log(textFileInputPath)
        console.log(path.join(directoryPath, "final.pdf"))
        const pdfFileOutputPath = fs.createWriteStream(path.join(directoryPath, "final.pdf"))
        console.log("C")
        console.log(pdfFileOutputPath)

        const pdfPipe = latexCompiler(textFileInputPath)
        pdfPipe.pipe(pdfFileOutputPath)
        console.log("D")

        console.log(textFileInputPath)
        console.log(pdfFileOutputPath)

        pdfPipe.on("error", error => {
            console.log("NO")
            console.error(error)
            res.statusCode = 400
            res.send({status: "failure"})
            return
        })

        pdfPipe.on("finish", () => {
            console.log("YES")
            res.send({status: "success"})
        })

        console.log("E")
    })
})

module.exports = router