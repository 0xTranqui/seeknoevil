import { Player, useCreateAsset } from "@livepeer/react";
import { parseArweaveTxId, parseCid } from "../../utils/livpeer";
import { useState, useEffect, useCallback, useMemo } from "react";

type Props = {
  thumnbnailURL: string;
  videoPath: string;
};

const VideoPlayer: React.FC<Props> = ({ videoPath, thumnbnailURL }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isUploaded, setIsUploaded] = useState(false);
  const [video, setVideo] = useState<File | undefined>();

  const {
    mutate: createAsset,
    data: asset,
    status,
    progress,
    error,
  } = useCreateAsset(
    video
      ? {
          sources: [{ name: video.name, file: video }] as const,
        }
      : null,
  );

  // temporary bandaid function due to way videoPath is currently being passed in
  const convertUrlFormat = useCallback((url: string): string => {
    const urlPattern = "https://cloudflare-ipfs.com/ipfs/";
    const newFormat = "ipfs://";

    if (url.startsWith(urlPattern)) {
      const cid = url.substring(urlPattern.length);
      return newFormat + cid;
    } else {
      throw new Error("Invalid URL format");
    }
  }, []);

//   const convertedVideoPath = useMemo(() => convertUrlFormat(videoPath), [videoPath, convertUrlFormat]);

//   const idParsed = useMemo(
//     () => parseCid(convertedVideoPath) ?? parseArweaveTxId(convertedVideoPath),
//     [convertedVideoPath]
//   );

const convertedVideoPath = "ipfs://bafybeifstyz4uux4msxihoxgfwd3ygtchvia67ewkdujzmd5bkicyjx22q"

const idParsed = useCallback(() => ({
  id: "bafybeifstyz4uux4msxihoxgfwd3ygtchvia67ewkdujzmd5bkicyjx22q"
}), []);

  console.log("idparsed: ", idParsed )
  //@ts-ignore
  console.log("idparsed.id: ", idParsed.id )

  useEffect(() => {
    const checkIfUploaded = async (ipfsCID: string) => {
        setIsLoading(true);
        const response = await fetch(`https://livepeer.studio/api/playback/${ipfsCID}`);
        if (response.status === 200) {
          console.log("video exists on livepeer")
          setIsUploaded(true);
        } else if (response.status === 404) {
          console.log("video does NOT exist on livepeer. STATUS CODE: ", response.status)
          const response2 = await fetch(`https://cloudflare-ipfs.com/ipfs/${ipfsCID}`);
          if (response2.ok) {
            const blob = await response2.blob();
            const file = new File([blob], "generic_filename", { type: blob.type });
            setVideo(file);
          }
        } else {
          console.log("Unexpected response status: ", response.status);
        }
        setIsLoading(false);
      };
    if (idParsed) {
      checkIfUploaded(idParsed().id);
    }
  }, [idParsed]);

  useEffect(() => {
    if (video && !isUploaded) {
        // @ts-ignore
      createAsset();
    }
  }, [video, isUploaded, createAsset])

  const progressFormatted = useMemo(
    () =>
      progress?.[0].phase === 'failed'
        ? 'Failed to process video.'
        : progress?.[0].phase === 'waiting'
        ? 'Waiting'
        : progress?.[0].phase === 'uploading'
        ? `Uploading: ${Math.round(progress?.[0]?.progress * 100)}%`
        : progress?.[0].phase === 'processing'
        ? `Processing: ${Math.round(progress?.[0].progress * 100)}%`
        : null,
    [progress],
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

if (progressFormatted) {
  return (
    <div>
      {progressFormatted}
      <progress value={progress ? progress[0].progress * 100 : 0} max="100" />
    </div>
  );
}


  if (!idParsed || !isUploaded) {
    return (
      <div className="flex flex-row justify-center w-full sm:h-[645px]  bg-black overflow-hidden">
        <div className="flex flex-row justify-center w-full cursor-pointer">
          <video
            poster={thumnbnailURL}
            src={videoPath}
            controls
            className="border-[0px]"
            loop
            style={{ outline: "none", width: "100%", height: "100%" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>omg livepeer is working</div>
      <Player
        src={convertedVideoPath}
        autoPlay
        muted
        autoUrlUpload={{ fallback: true, ipfsGateway: 'https://w3s.link' }}
      />
    </div>
  );
};

export default VideoPlayer;





// import { Player, useCreateAsset } from "@livepeer/react";
// import { parseArweaveTxId, parseCid } from "../../utils/livpeer";
// import { useState, useCallback, useMemo } from "react";

// type Props = {
//   thumnbnailURL: string;
//   videoPath: string;
// };

// const VideoPlayer: React.FC<Props> = ({ videoPath, thumnbnailURL }) => {
//   // temporary bandaid function due to way videoPath is currently being passed in
//   const convertUrlFormat = (url: string): string => {
//     const urlPattern = "https://cloudflare-ipfs.com/ipfs/";
//     const newFormat = "ipfs://";
//     if (url.startsWith(urlPattern)) {
//       const cid = url.substring(urlPattern.length);
//       return newFormat + cid;
//     } else {
//       throw new Error("Invalid URL format");
//     }
//   };
// //   const convertedVideoPath = videoPath ? convertUrlFormat(videoPath) : ""
//   const convertedVideoPath = "ipfs://bafybeihjhdtdk3zdnnhpgh34p7mhmge3wabo5ve26bypiwuc6k534agtse"

//   const idParsed = useMemo(
//     () => parseCid(convertedVideoPath) ?? parseArweaveTxId(convertedVideoPath),
//     [convertedVideoPath]
//   );

//   console.log("id parsed", idParsed)

// //   const idParsed = false

// // checks if video has been uploaded to livepeer previously
// const [isUploaded, setIsUploaded] = useState(false)
// const [video, setVideo] = useState<File | undefined>()
// // TODO: make it compatible with arweave
// const checkIfUploaded = async (ipfsCID: string) => {
//     fetch(
//       `https://livepeer.studio/api/playback/${ipfsCID}`
//     ).then((response) => {
//       console.log("video exists on livepeer")
//       setIsUploaded(true)
//     })
//     .catch((error) => {
//       console.log("video does NOT exist on livepeer. ERROR READOUT: ", error)
//       fetch(
//         `https://cloudflare-ipfs.com/ipfs/${ipfsCID}`
//       )
//       .then(async (response: Response) => {
//         if (response.ok) {
//           const blob = await response.blob();
//           const file = new File([blob], "generic_filename", { type: blob.type });
//           setVideo(file);
//         }
//       })
//     })
//   }




// const {
//   mutate: createAsset,
//   data: asset,
//   status,
//   progress,
//   error,
// } = useCreateAsset(
//   video
//     ? {
//         sources: [{ name: video.name, file: video }] as const,
//       }
//     : null,
// );


// const progressFormatted = useMemo(
//     () =>
//       progress?.[0].phase === 'failed'
//         ? 'Failed to process video.'
//         : progress?.[0].phase === 'waiting'
//         ? 'Waiting'
//         : progress?.[0].phase === 'uploading'
//         ? `Uploading: ${Math.round(progress?.[0]?.progress * 100)}%`
//         : progress?.[0].phase === 'processing'
//         ? `Processing: ${Math.round(progress?.[0].progress * 100)}%`
//         : null,
//     [progress],
//   );


//   // if the path isnt a valid ipfs/arweave id, insert original videoPath and use non livepeer playr
//   if (!idParsed) {
//     return (
//         <div className="flex flex-row justify-center w-full sm:h-[645px]  bg-black overflow-hidden">
//           <div className="flex flex-row justify-center w-full cursor-pointer">
//             <video
//               poster={thumnbnailURL}
//               src={'https://cloudflare-ipfs.com/ipfs/bafybeigyog46onizmgn4g4mqf6pjpb2p3v63u52rjc4qeufmtcqncy3m44'}
//               controls
//               className="border-[0px]"
//               loop
//               style={{ outline: "none", width: "100%", height: "100%" }}
//             />
//           </div>
//         </div>
//       );    
//   } else {
//     return (
//         <div>
//             <div>
//                 omg livepeer is working
//             </div>
//             <Player
//                 src={convertedVideoPath}
//                 autoPlay
//                 muted
//                 autoUrlUpload={{ fallback: true, ipfsGateway: 'https://w3s.link' }}
                
//             />
//         </div>
//     )
//   }
// };

// export default VideoPlayer;
