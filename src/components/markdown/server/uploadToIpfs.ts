// @ts-nocheck

import { nanoid } from 'nanoid';
import { File, Web3Storage } from 'web3.storage';
import MarkdownFileData from '../types/MarkdownFileData';
import getValidMarkdownFilename from '../../../utils/getValidMarkdownFilename';

// Creates a web3.storage client
function makeStorageClient() {
  const storageToken = process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY;

  if (storageToken == null) {
    throw Error('Web3 Storage token not defined');
  }

  return new Web3Storage({ token: storageToken });
}

// Uploads Markdown to IPFS
export type PublishRequest = MarkdownFileData;
export const publishMarkdownToIpfs = async ({
  filename,
  markdown,
}: PublishRequest): Promise<string> => {
  // Create a file name if none was given
  const validFileName = filename ? filename : nanoid(5);

  return uploadToIpfs({
    name: getValidMarkdownFilename(validFileName),
    arrayBuffer: Buffer.from(markdown),
  });
};

// Uploads an arbitrary file to IPFS
export const uploadToIpfs = async (file: { name: string; arrayBuffer: Buffer }): Promise<string> => {
  if (!file.name || !file.arrayBuffer) {
    throw new Error('File name and buffer must be defined');
  }

  const client = makeStorageClient();
  const ipfsFile = new File([new Uint8Array(file.arrayBuffer)], file.name);

  const cid = await client.put([ipfsFile], {
    wrapWithDirectory: false,
  });

  if (!cid) {
    throw new Error('Failed to upload file to IPFS, no CID returned');
  }

  return cid;
};
