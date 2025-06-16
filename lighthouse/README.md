This is a Lighthouse (Filecoin) example pad https://docs.lighthouse.storage/
we want to collect code example and workflows for uploading and downloading files to and from Filecoin via lighthouse sdk.

# Usage 
0. ```pnpm install```
1. ```npm install -g @lighthouse-web3/sdk```
2. ```lighthouse-web3 --help```
3. ```lighthouse-web create-wallet``` # add publicKey to LIGHTHOUSE_PUBLIC_KEY in .env 
4. ```lighthouse-web api-key --new``` # add api-key to LIGHTHOUSE_API_KEY .env 
5. ```pnpm start```
6. ```curl https://gateway.lighthouse.storage/ipfs/CID``` # Make sure to replace 'CID' with the actual Content Identifier of your file.Retrieve File: https://docs.lighthouse.storage/lighthouse-1/how-to/retrieve-file
