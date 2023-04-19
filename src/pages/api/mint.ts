// @ts-nocheck

import { getFilesFromPath } from 'web3.storage';

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
const parseRequest = async (
  req: NextApiRequest
): Promise<UploadRequest | undefined> => {
  const form = formidable({
    maxFileSize: MAX_UPLOAD_SIZE,
  });

  return new Promise<UploadRequest | undefined>((resolve) => {
    // Parse files from form
    form.parse(req, (err, fields, files) => {

        if (files && files.file && 'filepath' in files.file) {
        
        const file = files.file;

        // Check the file keyed by "file"
        if (!checkUploadSize(file.size)) {
          console.log('Invalid file sent', file);
          resolve(undefined);
          return;
        }

        const sentFilepath = file.filepath as string;

        // Retrieve the file from the filepath
        getFilesFromPath([sentFilepath]).then((files) => {
          if (files.length > 0) {
            resolve({
              file: files[0] as unknown as File,
            });
          } else {
            resolve(undefined);
          }
        });
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