// @ts-nocheck

import React from 'react';
import { shortenAddress } from '../../utils/shortenAddress';
import ListingInfo from '../mintSection/ListingInfo';

type Props = {
    collectionAddress?: string,
    tokenId?: string
};

const video = "https://ipfs.io/ipfs/bafybeid3ec4bqdt7hxwbkxeeb3h2rbcgxxaetmu7ppglnf32bqc6dgey6i?id=1"
const thumbnail = "https://ipfs.io/ipfs/bafybeic24sze23dhuxso4mrqtwlf2r4hy3oopxsu2z65nmdaghx7ukmwam?id=1"

const VideoPlayer: React.FC<Props> = ({ collectionAddress, tokenId }) => {
    return (
        <div className="flex flex-row justify-center w-full sm:h-[645px] border-[2px] border-red-500 bg-black overflow-hidden">
            <div className="flex flex-row justify-center w-full cursor-pointer">
                <video poster={thumbnail} src={video} controls className='border-[0px]' loop style={{ outline: "none", width: '100%', height: '100%' }} />
            </div>
        </div>
    );
};

export default VideoPlayer;