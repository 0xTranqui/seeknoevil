// @ts-nocheck

import React from 'react';

type Props = {
    ipfsPath: string,
    thumnbnailURL: string,
    collectionAddress?: string,
    tokenId?: string

};

const VideoPlayer: React.FC<Props> = ({ videoPath, thumnbnailURL }) => {
    return (
        <div className="flex flex-row justify-center w-full sm:h-[645px]  bg-black overflow-hidden">
            <div className="flex flex-row justify-center w-full cursor-pointer">
                <video poster={thumnbnailURL} src={videoPath} controls className='border-[0px]' loop style={{ outline: "none", width: '100%', height: '100%' }} />
            </div>
        </div>
    );
};

export default VideoPlayer;