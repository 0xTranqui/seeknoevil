// @ts-nocheck

import { getFilesFromPath } from 'web3.storage';
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { uploadToIpfs } from '../../components/markdown/server/uploadToIpfs';
import sendInvalidRequestResponse from '../../components/markdown/server/util/sendInvalidRequestResponse';
import EndpointResult from '../../components/markdown/types/EndpointResult';
import executeAsyncForResult from '../../utils/executeAsyncForResult';
import {
  checkUploadSize,
  isImageMimeType,
  MAX_UPLOAD_SIZE,
} from '../../utils/fileUploadUtils';
import resultToEndpointResult from '../../utils/resultToEndpointResult';
import formidable from 'formidable';

export type ApiMintResponse = EndpointResult<{
  cid: string;
}>;

type UploadRequest = {
  file: File;
};

// Parses the file sent in the multipart form data under form.file
const parseRequest = async (req: NextApiRequest): Promise<UploadRequest | undefined> => {
  const form = formidable({
    maxFileSize: MAX_UPLOAD_SIZE,
  });

  return new Promise<UploadRequest | undefined>((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      console.log('Files:', files);
      console.log('Error:', err);

      if (err) {
        reject(err);
        return;
      }



      if (files && files.file) {
        const file = files.file;
        let buffer: Buffer;

        console.log('File check in mint.ts:', file);
        if (file instanceof formidable.File) {
          buffer = await fs.promises.readFile(file.filepath);
        } else if (file instanceof Buffer) {
          buffer = file;
        } else {
          reject(new Error('Invalid file input'));
          return;
        }

        if (checkUploadSize(buffer.length)) {
          resolve({
            file: {
              name: file.name,
              type: file.type,
              size: buffer.length,
              arrayBuffer: buffer,
            },
          });
        } else {
          resolve(undefined);
        }
      } else {
        resolve(undefined);
      }
    });
  });
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiMintResponse>
) {
  if (req.method !== 'POST') {
    sendInvalidRequestResponse(res);
    return;
  }

  const uploadRequest = await parseRequest(req);

  if (!uploadRequest) {
    res.status(400).json({
      error: 'Invalid file',
    });
    return;
  }

  const uploadResult = await executeAsyncForResult(async () => {
    return {
      cid: await uploadToIpfs(uploadRequest.file),
    };
  });

  res.status(200).json(resultToEndpointResult(uploadResult));
}

export const config = {
  api: {
    bodyParser: false,
  },
};