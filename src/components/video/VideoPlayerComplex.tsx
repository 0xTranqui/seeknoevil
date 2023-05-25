import { Player, useCreateAsset, useAssetMetrics } from "@livepeer/react";
import { parseArweaveTxId, parseCid } from "../../utils/livpeer";
import { useState, useEffect, useCallback, useMemo } from "react";

type Props = {
  thumnbnailURL: string;
  videoPath: string;
};

const VideoPlayerComplex: React.FC<Props> = ({ videoPath, thumnbnailURL }) => {

    function convertUrlFormat(url: string): string {
        const urlPattern = "https://cloudflare-ipfs.com/ipfs/";
        const newFormat = "ipfs://";
    
        if (url.startsWith(urlPattern)) {
            const cid = url.substring(urlPattern.length);
            return newFormat + cid;
        } else {
            throw new Error("Invalid URL format");
        }
    }

    const formattedVideoPath = convertUrlFormat(videoPath)

    return (
        <div className="flex flex-row justify-center w-full sm:h-[645px]  bg-black overflow-hidden">
            <div className="flex flex-row justify-center w-full cursor-pointer">
                <Player 
                    src={formattedVideoPath}
                    showUploadingIndicator
                    autoUrlUpload
                />                        
            </div>
        </div>
    );
};

export default VideoPlayerComplex;

/* saving long videos for testing/proof purposes */
// const convertedVideoPath = "ipfs://bafybeifstyz4uux4msxihoxgfwd3ygtchvia67ewkdujzmd5bkicyjx22q"
// const convertedVideoPath = "ipfs://bafybeigyog46onizmgn4g4mqf6pjpb2p3v63u52rjc4qeufmtcqncy3m44"
// const convertedVideoPath = "ipfs://bafybeihfsdi2utr7ia5iw74m7xb4eqtpzsozf26776qu6cvv52ytk6yqrq"
