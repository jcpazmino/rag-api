// This file contains functions for processing PDF files, such as uploading and extracting data.

const fs = require('fs');
const pdf = require('pdf-parse');

// Function to upload a PDF file
const uploadPDF = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
};

// Function to extract text from a PDF file
const extractTextFromPDF = (dataBuffer) => {
    return pdf(dataBuffer).then(function(data) {
        return data.text;
    });
};

// Exporting the functions
module.exports = {
    uploadPDF,
    extractTextFromPDF
};