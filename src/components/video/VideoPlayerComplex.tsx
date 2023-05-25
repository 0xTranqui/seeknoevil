// import { Player, useCreateAsset, useAssetMetrics } from "@livepeer/react";
// import { parseArweaveTxId, parseCid } from "../../utils/livpeer";
// import { useState, useEffect, useCallback, useMemo } from "react";

// type Props = {
//     thumnbnailURL: string;
//     videoPath: string;
//   };
  
//   const VideoPlayerComplex: React.FC<Props> = ({ videoPath, thumnbnailURL }) => {
//     const [isUploaded, setIsUploaded] = useState(false);
//     const [video, setVideo] = useState<File | undefined>();
  
//       function convertUrlFormat(url: string): string {
//           const urlPattern = "https://cloudflare-ipfs.com/ipfs/";
//           const newFormat = "ipfs://";
      
//           if (url.startsWith(urlPattern)) {
//               const cid = url.substring(urlPattern.length);
//               return newFormat + cid;
//           } else {
//               throw new Error("Invalid URL format");
//           }
//       }
  
//       const formattedVideoPath = convertUrlFormat(videoPath)
      
//       const {
//         mutate: createAsset,
//         data: asset,
//         status,
//         progress,
//         error,
//       } = useCreateAsset(
//         video
//           ? {
//               sources: [{ name: video.name, file: video }] as const,
//             }
//           : null,
//       );      


//       const idParsed = useCallback(() => ({
//         id: "bafybeifstyz4uux4msxihoxgfwd3ygtchvia67ewkdujzmd5bkicyjx22q"
//       }), []);
      
//         console.log("idparsed: ", idParsed )
//         //@ts-ignore
//         console.log("idparsed.id: ", idParsed.id )
      
//           useEffect(() => {
//               const checkIfUploaded = async (ipfsCID: string) => {
//                   const response = await fetch(`https://livepeer.studio/api/playback/${ipfsCID}`);
//                   if (response.status === 200) {
//                       console.log("video exists on livepeer")
//                       setIsUploaded(true);
//                   } else if (response.status === 404) {
//                       console.log("video does NOT exist on livepeer. STATUS CODE: ", response.status)
//                       const response2 = await fetch(`https://cloudflare-ipfs.com/ipfs/${ipfsCID}`);
//                       if (response2.ok) {
//                           const blob = await response2.blob();
//                           const file = new File([blob], "generic_filename", { type: blob.type });
//                           setVideo(file);
//                       }
//                   } else {
//                       console.log("Unexpected response status: ", response.status);
//                   }
//               };
//               if (idParsed) {
//                   checkIfUploaded(idParsed().id);
//               }
//           }, [idParsed]);
      
//         useEffect(() => {
//           if (video && !isUploaded) {
//               // @ts-ignore
//             createAsset();
//           }
//         }, [video, isUploaded, createAsset])
      
//         const progressFormatted = useMemo(
//           () =>
//             progress?.[0].phase === 'failed'
//               ? 'Failed to process video.'
//               : progress?.[0].phase === 'waiting'
//               ? 'Waiting'
//               : progress?.[0].phase === 'uploading'
//               ? `Uploading: ${Math.round(progress?.[0]?.progress * 100)}%`
//               : progress?.[0].phase === 'processing'
//               ? `Processing: ${Math.round(progress?.[0].progress * 100)}%`
//               : null,
//           [progress],
//         );

//       return (
//           <div className="flex flex-row justify-center w-full sm:h-[645px]  bg-black overflow-hidden">
//               <div className="flex flex-row justify-center w-full cursor-pointer">
//                   <Player 
//                       src={formattedVideoPath}
//                       showUploadingIndicator
//                       autoUrlUpload={{ fallback: true, ipfsGateway: 'https://cloudflare-ipfs.com' }}
//                   />                        
//               </div>
//           </div>
//       );
//   };
  
//   export default VideoPlayerComplex;

// /* saving long videos for testing/proof purposes */
// // const convertedVideoPath = "ipfs://bafybeifstyz4uux4msxihoxgfwd3ygtchvia67ewkdujzmd5bkicyjx22q"
// // const convertedVideoPath = "ipfs://bafybeigyog46onizmgn4g4mqf6pjpb2p3v63u52rjc4qeufmtcqncy3m44"
// // const convertedVideoPath = "ipfs://bafybeihfsdi2utr7ia5iw74m7xb4eqtpzsozf26776qu6cvv52ytk6yqrq"
