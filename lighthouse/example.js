/**
 * @typedef {import('@lighthouse-web3/sdk').Lighthouse} Lighthouse
 */
import dotenv from 'dotenv';
import lighthouse from "@lighthouse-web3/sdk";
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/**
 * Main function to demonstrate Lighthouse SDK usage
 * @returns {Promise<void>}
 */
export async function main() {
    try {
        const inputPath = path.join(__dirname, 'input.txt');
        const uploadResponse = await lighthouse.upload(inputPath, process.env.LIGHTHOUSE_API_KEY);

        console.log('Upload successful:', uploadResponse);
        const cid = uploadResponse.data.Hash;

        // Check if file is on Filecoin using SDK
        const isOnFilecoin = await checkFileOnFilecoin(cid);
        console.log(`File ${isOnFilecoin ? 'is' : 'is not'} stored on Filecoin`);

        // Download and display file contents
        if (isOnFilecoin) {
            await downloadAndDisplayFile(cid, inputPath);
        }

    } catch (error) {
        console.error('Error:', error);
    }
} 

/**
 * Checks if a file is stored on Filecoin network using Lighthouse SDK
 * @param {string} cid - The CID of the file to check
 * @returns {Promise<boolean>} - Returns true if file is found on Filecoin
 */
async function checkFileOnFilecoin(cid) {
    try {
        console.log('Checking file on Filecoin:', cid);
        const uploads = await lighthouse.getUploads(process.env.LIGHTHOUSE_API_KEY);
        // console.log('Uploads:', JSON.stringify(uploads, null, 2));
        const fileUpload = uploads.data.fileList.find(upload => upload.cid === cid);
        if (fileUpload) {
            console.log('File upload details:', fileUpload);
            console.log('totalFiles', uploads.data.totalFiles);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error checking Filecoin storage:', error.message);
        return false;
    }
}

/**
 * Downloads and displays file contents from Lighthouse
 * @param {string} cid - The CID of the file to download
 * @param {string} originalFilePath - Path to the original uploaded file
 * @returns {Promise<void>}
 */
async function downloadAndDisplayFile(cid, originalFilePath) {
    try {
        const lighthouseDealDownloadEndpoint = 'https://gateway.lighthouse.storage/ipfs/';
        const response = await axios({
            method: 'GET',
            url: `${lighthouseDealDownloadEndpoint}${cid}`,
            responseType: 'arraybuffer'
        });
        
        const downloadedContent = Buffer.from(response.data).toString('utf-8');
        console.log('Downloaded file contents:', downloadedContent);
        
        // Read original file
        const originalContent = await fs.promises.readFile(originalFilePath, 'utf-8');
        console.log('Original file contents:', originalContent);
        
        // Compare contents
        const isIdentical = downloadedContent === originalContent;
        console.log('Files are identical:', isIdentical);
        
        // Save downloaded file
        const outputPath = path.join(__dirname, 'downloaded.txt');
        await fs.promises.writeFile(outputPath, response.data);
        console.log(`File also saved to ${outputPath}`);
    } catch (error) {
        console.error('Failed to download or display the file:', error);
    }
}
