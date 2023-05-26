import React from 'react';
import { shortenAddress } from '../../utils/shortenAddress';

type Props = {
    collectionAddress: string,
    tokenId: string
};

const ListingInfo: React.FC<Props> = ({ collectionAddress, tokenId }) => {
  return (
    <div className="flex flex-row flex-wrap w-full">
      <div className='font-IBMPlexMono flex flex-row w-full font-bold'>
        contract address:&nbsp;
        <a 
        className="hover:underline font-IBMPlexMonoLight font-normal"
        href={`https://sepolia.etherscan.io/address/${collectionAddress}`}
        >
        {shortenAddress(collectionAddress)}
        </a>
      </div>
      <div className='font-IBMPlexMono flex flex-row w-full font-bold'>
        tokenID:&nbsp;
        <a 
        className="hover:underline font-IBMPlexMonoLight font-normal"
        href={`https://sepolia.etherscan.io/nft/${collectionAddress}/${tokenId}`}
        >
        {tokenId}
        </a>
      </div>      
    </div>
  );
};

export default ListingInfo;
