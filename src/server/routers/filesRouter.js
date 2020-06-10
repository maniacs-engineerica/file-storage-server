import express from 'express'
import fs from 'fs';

import { createUploader, getAllFiles } from '../helpers/fileHelper.js';

import config from '../../../config.js'
import InvalidRequestError from '../errors/invalidRequestError.js';

const router = express.Router()

const uploader = createUploader(config.absoluteImageDir)

router.post('/input', uploader.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            throw new InvalidRequestError("File not submitted", "Request does not include a file parameter or upload has failed")
        }
        const response = {
            mimetype: req.file.mimetype,
            filename: req.file.filename,
            size: req.file.size
        }
        res.status(201).json(response)
    } catch (e) {
        res.status(e.status).json(e)
    }
})

router.get('/output/all', async (req, res) => {
    try {
        const files = await getAllFiles(config.absoluteImageDir)
        const dir = getPublicUploadDir(req)
        const results = files.map(file => dir + file)
        res.status(200).json(results)
    } catch (e) {
        res.status(e.status).json(e.message)
    }
})

router.get('/output/:id', async (req, res) => {
    try {
        if (!req.params.id){
            throw new InvalidRequestError("Parameter 'Id' is required", "Parameter 'Id' was not found in the specified request")
        }
        const filePath = config.absoluteImageDir + req.params.id;
        if (!fs.existsSync(filePath)){
            throw new InvalidRequestError("File not found", "Specified id does not match with any file")
        }
        res.sendFile(filePath);
    } catch (e) {
        res.status(e.status).json(e.message)
    }
})

function getPublicUploadDir(req){
    return req.protocol + "://" + req.headers.host + config.publicImageDir + "/";
}

export default router