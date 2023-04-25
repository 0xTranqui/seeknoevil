// @ts-nocheck

import { NextPage } from 'next'
import { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { useCurationData } from "../providers/CurationDataProvider";
import MarkdownViewer from '../components/markdown/MarkdownViewer';
import { shortenAddress } from '../utils/shortenAddress';
import useMintExisting from '../hooks/useMintExisting';
import { useAuth } from '../hooks/useAuth';
import { useModal } from 'connectkit';
import ListingInfo from '../components/mintSection/ListingInfo';
import useNumMinted from '../hooks/useNumMinted';
import useTotalSupply from '../hooks/useTotalSupply';
import VideoPlayer from '../components/video/VideoPlayer';

const ListingPage: NextPage = () => {
    const router = useRouter(); 
    const { listing } = router.query;
    const listingId: any = listing ? listing : ""
    const { listed, updated, parsed } = useCurationData();
    const { address } = useAuth()
    const { setOpen } = useModal()

    const hasMarkdownPattern = (text) => {
        const markdownPatterns = [
          /^#.*$/m, // Headers
          /\*\*.*\*\*/, // Bold
          /\*.*\*/, // Italic
          /!\[.*\]\(.*\)/, // Images
          /\[.*\]\(.*\)/, // Links
          /^>.*$/m, // Blockquotes
          /^- .*$/m, // Unordered lists
          /^\d+\. .*$/m, // Ordered lists
          /^```[\s\S]*```/m, // Fenced code blocks
          /^`.*`$/, // Inline code
        ];
      
        return markdownPatterns.some((pattern) => pattern.test(text));
      };
      
      const fetchMediaType = async (ipfsPath) => {
        if (!ipfsPath) return null;
      
        try {
          const response = await fetch(ipfsPath);
      
          if (!response.ok) {
            throw new Error("Failed to fetch media");
          }
      
          const buffer = await response.arrayBuffer();
          const uint8Array = new Uint8Array(buffer);
      
          // Check for MP4, WebM, and Ogg formats
          const magicNumber = uint8Array.slice(0, 8);
          const mp4Signature = [0x00, 0x00, 0x00, [0x14, 0x20], 0x66, 0x74, 0x79, 0x70];
          const webmSignature = [0x1A, 0x45, 0xDF, 0xA3];
          const oggSignature = [0x4F, 0x67, 0x67, 0x53];
      
          const isMp4 = magicNumber.slice(0, 4).every((value, index) => {
            return value === mp4Signature[index] || index === 3 && mp4Signature[3].includes(value);
          }) && magicNumber.slice(4).every((value, index) => value === mp4Signature[index + 4]);
      
          const isWebm = magicNumber.slice(0, 4).every((value, index) => value === webmSignature[index]);
          const isOgg = magicNumber.slice(0, 4).every((value, index) => value === oggSignature[index]);
      
          if (isMp4 || isWebm || isOgg) {
            return "video";
          }
      
          // Check for markdown
          const textDecoder = new TextDecoder();
          const textContent = textDecoder.decode(uint8Array);
          if (hasMarkdownPattern(textContent)) {
            return "markdown";
          }
        } catch (error) {
          console.error("Failed to fetch media type:", error);
          return null;
        }
      };
      
    console.log("parsed", parsed)


    const tokenIdToMint = parsed && parsed[listingId]?.tokenId;
    const userAddress = address ? address : null

    const { numMinted, fetchNumMinted } = useNumMinted({
        collectionAddress: process.env.NEXT_PUBLIC_AP_1155_CONTRACT,
        tokenId: tokenIdToMint
    })

    const { totalSupply, fetchTotalSupply } = useTotalSupply({
        collectionAddress: process.env.NEXT_PUBLIC_AP_1155_CONTRACT,
        tokenId: tokenIdToMint
    })

    // function to refresh mint counts on successful mintExisting call
    const refreshMintData = () => {
        fetchNumMinted()
        fetchTotalSupply()
    }

    const {
        config,
        error,
        write,
        data,
        isError,
        isLoading,
        isSuccess,
        status,
        mintExistingData,
        mintExistingLoading        
    } = useMintExisting({
        tokenId: tokenIdToMint,
        userAddress: userAddress,
        onSuccessCB: refreshMintData
    })

    const handleMintInteraction = () => {
        if (userAddress) {
            write?.()
        } else {
            setOpen?.()
        }
    }

    // state for loading txns
    const svgLoader = () => {
        return (
            <div className="flex flex-row justify-center items-center w-full fill-black ">
                {/* <img
                className='fill-black'
                width="20px"
                src="../public/SVG-Loaders/svg-loaders/tail-spin.svg"
                /> */}
                <svg fill="#fff" width="38" height="20" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
                            <stop stop-color="#fff" stop-opacity="0" offset="0%"/>
                            <stop stop-color="#fff" stop-opacity=".631" offset="63.146%"/>
                            <stop stop-color="#fff" offset="100%"/>
                        </linearGradient>
                    </defs>
                    <g fill="none" fill-rule="evenodd">
                        <g transform="translate(1 1)">
                            <path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" stroke-width="2">
                                <animateTransform
                                    attributeName="transform"
                                    type="rotate"
                                    from="0 18 18"
                                    to="360 18 18"
                                    dur="0.9s"
                                    repeatCount="indefinite" />
                            </path>
                            <circle fill="#fff" cx="36" cy="18" r="1">
                                <animateTransform
                                    attributeName="transform"
                                    type="rotate"
                                    from="0 18 18"
                                    to="360 18 18"
                                    dur="0.9s"
                                    repeatCount="indefinite" />
                            </circle>
                        </g>
                    </g>
                </svg>

            </div>
        )
    }    

    const collectButtonContent = 
        numMinted > 0 
        ? "Collected!" 
        : isLoading || mintExistingLoading
        ? svgLoader()
        : isSuccess && !mintExistingLoading && !isLoading 
        ? "Collected!" : "Collect – 0.00 ETH"     

    const processIPFS = (ipfsPlain: string) => {
        // let converted = "https://ipfs.io/ipfs/" + ipfsPlain.slice(7)
        let converted = "https://cloudflare-ipfs.com/ipfs/" + ipfsPlain.slice(7)
        // let converted = "https://ipfs.infura.io/ipfs/" + ipfsPlain.slice(7)
        // let converted = "https://cors-anywhere.herokuapp.com/https://ipfs.io/ipfs/" + ipfsPlain.slice(7);
        return converted
    }

    const animationUrl = parsed && parsed[listingId]?.rawMetadata?.animation_url;
    const ipfsPath = animationUrl ? processIPFS(animationUrl) : '';

    const title = parsed && parsed[listingId]?.title
    const author = parsed && parsed[listingId]?.contract.contractDeployer

    const convertDate = (date) => {
        const dateObj = new Date(date)
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options).toLowerCase();
        return formattedDate
    }        
    const publicationDate = parsed && convertDate(parsed[listingId]?.timeLastUpdated)

    const [mediaType, setMediaType] = useState(null);


    console.log("media type before hook", mediaType)
    useEffect(() => {
        (async () => {
            console.log("fetching media type")
          const type = await fetchMediaType(ipfsPath);
          console.log("media type", type)
          setMediaType(type);
        })();
      }, [ipfsPath]);
      

    if (!mediaType) {
        return (
            <div>
                Loading...
            </div>
        )
    } else if (mediaType === 'markdown') {
        return (
            <div className="text-[14px] flex flex-row flex-wrap  bg-[#FFFFFF] min-h-[100vh] pt-10 pb-[90px] sm:pb-[108px] h-full w-full justify-center ">
                <div className=' w-[360px] sm:w-[500px] md:w-[625px] pt-[80px] sm:pt-[110px]'>
                    <div className="font-[helvetica] flex flex-row w-full justify-start text-[26px] font-normal">
                        {title}
                    </div>
                    <div className="font-[helvetica] italic flex flex-row w-full justify-start text-[15px] mt-[35px] sm:mt-[58px] mb-[6px]">
                        <div className="font-[helvetica]">published by&nbsp;</div>
                            <a href={`https://goerli.etherscan.io/address/${author}`} className="font-[helvetica] hover:underline">
                                {shortenAddress(author)}
                            </a>
                            &nbsp;{"– " + publicationDate}
                    </div>            
                    {ipfsPath && (
                        <MarkdownViewer ipfsPath={ipfsPath} />
                    )}
                    <ListingInfo
                        collectionAddress={process.env.NEXT_PUBLIC_AP_1155_CONTRACT}
                        tokenId={tokenIdToMint}
                    />
                    <div className="w-full flex flex-row mt-[65px] items-center">
                        {/* 
                            this button is being disabled whenever someone has minted at least one token. 
                            this is correct for free mints where mint cap per wallet = 1, but is incorrect for
                            paid mints where users can mint unlimited quantity
                        */}
                        <button 
                        disabled={numMinted > 0 || (isSuccess && !mintExistingLoading && !isLoading) ? true : false}
                        onClick={()=>handleMintInteraction?.()} className={`${isLoading || mintExistingLoading ? "bg-black text-white" : ""} disabled:cursor-default focus:bg-black focus:text-white text-center min-h-[46px] min-x-[186px] h-[46px] w-[186px] text-[14px] border-[1px] border-black font-[helvetica] rounded-[35px]   hover:cursor-pointer`}>
                            {collectButtonContent} 
                        </button>                    
                        <div className="ml-[23px] text-black font-IBMPlexMono">
                            {totalSupply}&nbsp;minted
                        </div>
                    </div>
                </div>
            </div>
        )
    } else if (mediaType === 'video') {
        return (
            <div className="text-[14px] flex flex-col sm:items-center bg-[#FFFFFF] min-h-[100vh] pt-[77px] sm:pt-10 pb-[90px] sm:pb-[108px] h-full w-full sm:justify-center">
                <div className='sm:pt-[25px] border-green-500 border-2  w-full'>
                    <VideoPlayer />
                    <div className="flex flex-col sm:flex-row border-2 border-blue-500 w-full sm:justify-between mt-4 sm:mt-0">
                        <div className="pl-[17px] sm:pl-[48px] pt-[16px] sm:border-2 sm:border-pink-400">
                            <div className="font-[helvetica] text-[20px] font-normal">
                                {title} This is a video demo 
                            </div>
                            <div className="flex flex-row font-[helvetica] text-[14px]">
                                <div className="font-[helvetica]">by&nbsp;</div>
                                <a href={`https://goerli.etherscan.io/address/${author}`} className="font-[helvetica] hover:underline">
                                    {shortenAddress(author)} seeknoevil.eth
                                </a>
                                &nbsp;{"– " + publicationDate}
                            </div>
                            <div className="font-[helvetica] text-[14px] mt-[19px] mb-[60px] sm:mb-[19px] font-normal">
                                {description} This is the first demo of seeknoevil
                            </div>
                            <ListingInfo
                                collectionAddress={process.env.NEXT_PUBLIC_AP_1155_CONTRACT}
                                tokenId={tokenIdToMint}
                            />
                        </div>
                        <div className="px-4 sm:pr-[212px] sm:border-2 sm:border-green-400 flex flex-col sm:flex-row flex-wrap items-start">
                            <div className="w-full flex flex-row items-center pt-[16px] mb-[19px]">
                                <button
                                    disabled={numMinted > 0 || (isSuccess && !mintExistingLoading && !isLoading) ? true : false}
                                    onClick={() => handleMintInteraction?.()} className={`${isLoading || mintExistingLoading ? "bg-black text-white" : ""} disabled:cursor-default focus:bg-black focus:text-white text-center min-h-[39px] min-x-[158px] h-[39px] w-[158px] text-[12px] border-[1px] border-black font-[helvetica] rounded-[35px]   hover:cursor-pointer`}>
                                    {collectButtonContent}
                                </button>
                                <div className="ml-[23px] text-black font-IBMPlexMono">
                                    {totalSupply}&nbsp;minted
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )        
    } else {
        return (
            <div>
                invalid file type
            </div>
        )
    }
}

export default ListingPage;  