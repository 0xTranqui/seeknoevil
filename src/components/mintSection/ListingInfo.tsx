import React from 'react';

type Props = {
    collectionAddress: string,
    tokenId: string
};

const ListingInfo: React.FC<Props> = ({ collectionAddress, tokenId }) => {
  return (
    <div className="flex flex-row flex-wrap w-full">
      <div className='font-IBMPlexMono flex flex-row w-full font-bold'>
        contract address:
        <a 
        className="font-IBMPlexMonoLight font-normal"
        href={`https://goerli.etherscan.io/address/${collectionAddress}`}
        >
        &nbsp;{collectionAddress}
        </a>
      </div>
      <div className='font-IBMPlexMono flex flex-row w-full font-bold'>
        tokenID:
        <a 
        className="font-IBMPlexMonoLight font-normal"
        href={`https://goerli.etherscan.io/nft/${collectionAddress}/${tokenId}`}
        >
        &nbsp;{tokenId}
        </a>
      </div>      
    </div>
  );
};

export default ListingInfo;
