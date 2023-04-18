import type { NextApiRequest, NextApiResponse } from 'next';
import { publishMarkdownToIpfs } from '../../components/markdown/server/uploadToIpfs';
import type { PublishRequest } from '../../components/markdown/server/uploadToIpfs';
import sendInvalidRequestResponse from '../../components/markdown/server/util/sendInvalidRequestResponse';
import EndpointResult from '../../components/markdown/types/EndpointResult';
import executeAsyncForResult from '../../utils/executeAsyncForResult';
import resultToEndpointResult from '../../utils/resultToEndpointResult';

export type ApiPublishResponse = EndpointResult<{
  cid: string;
}>;

const parseRequest = (body: any): PublishRequest | undefined => {
  if (!body) {
    return;
  }

  if (typeof body.markdown !== 'string') {
    return;
  }

  return {
    filename: body.filename,
    markdown: body.markdown,
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiPublishResponse>
) {
  if (req.method !== 'POST') {
    sendInvalidRequestResponse(res);
    return;
  }

  const publishRequest = parseRequest(req.body);

  if (publishRequest == null) {
    console.log('Invalid request to publish handler', req.body);
    sendInvalidRequestResponse(res);
    return;
  }

  const publishResult = await executeAsyncForResult(async () => {
    const publishedCid = await publishMarkdownToIpfs(publishRequest);
    return {
      cid: publishedCid,
    };
  });

  res.status(200).json(resultToEndpointResult(publishResult));
}