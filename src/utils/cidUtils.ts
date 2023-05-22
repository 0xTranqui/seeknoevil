import { Web3Storage } from 'web3.storage';

export const getCid = (cidOrPrefixedUrl: string): string => {
  return cidOrPrefixedUrl.replace('ipfs://', '');
};

export const addIpfsPrefix = (cid: string): string => {
  return 'ipfs://' + cid;
};

export const getCidGatewayUrl = (cid: string): string => {
  return `https://ipfs.io/ipfs/${getCid(cid)}`;
};

export const isIpfsCid = (possibleCid: string): boolean => {
  const isV0Cid = possibleCid.startsWith('Qm');
  const isV1Cid = possibleCid.startsWith('b');

  return isV0Cid || isV1Cid;
};

export const storeThing = async (client: any, ipfsFile: any) => {
  const cid = await client.put([ipfsFile], {
    wrapWithDirectory: false,
  });
  if (!cid) {
    throw new Error('Failed to upload file to IPFS, no CID returned');
  }
  return cid;
}

export const makeStorageClient = () => {
  const storageToken = process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY;

  if (storageToken == null) {
    throw Error('Web3 Storage token not defined');
  }

  return new Web3Storage({ token: storageToken });
}
