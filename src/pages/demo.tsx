// @ts-nocheck

import { NextPage } from 'next'
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

const Demo: NextPage = () => {
    const router = useRouter(); 
    const { listing } = router.query;
    const listingId: any = listing ? listing : ""
    const { listed, updated, parsed } = useCurationData();
    const { address } = useAuth()
    const { setOpen } = useModal()

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
        let converted = "https://ipfs.io/ipfs/" + ipfsPlain.slice(7)
        return converted
    }

    const animationUrl = parsed && parsed[listingId]?.rawMetadata?.animation_url;
    const ipfsPath = animationUrl ? processIPFS(animationUrl) : '';

    const title = parsed && parsed[listingId]?.title
    const author = parsed && parsed[listingId]?.contract.contractDeployer
    const description = parsed && parsed[listingId]?.description

    const convertDate = (date) => {
        const dateObj = new Date(date)
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options).toLowerCase();
        return formattedDate
    }        
    const publicationDate = parsed && convertDate(parsed[listingId]?.timeLastUpdated)

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
}
    

export default Demo;  


// return (
//     <div className="text-[14px] flex flex-row flex-wrap  bg-[#FFFFFF] min-h-[100vh] pt-10 pb-[90px] sm:pb-[108px] h-full w-full justify-center ">
//         <div className='flex flex-row flex-wrap pt-[25px]  items-start'>
//             <VideoPlayer />
//             <div className="flex flex-row border-2 border-blue-500 w-full justify-between">
//                 <div className="pl-[48px] pt-[16px] border-2 border-pink-400">
//                     <div className="font-[helvetica] flex flex-row w-full justify-start text-[20px] font-normal">
//                         {title} This is a video demo
//                     </div>
//                     <div className="font-[helvetica] flex flex-row w-full justify-start text-[14px]">
//                         <div className="font-[helvetica]">by&nbsp;</div>
//                             <a href={`https://goerli.etherscan.io/address/${author}`} className="font-[helvetica] hover:underline">
//                                 {shortenAddress(author)}
//                             </a>
//                             &nbsp;{"– " + publicationDate}
//                     </div>     
//                     <div className="font-[helvetica] flex flex-row w-full justify-start text-[14px] mt-[19px] mb-[19px] font-normal">
//                         {description} This is the first demo of seeknoevil
//                     </div> 
//                     <ListingInfo
//                         collectionAddress={process.env.NEXT_PUBLIC_AP_1155_CONTRACT}
//                         tokenId={tokenIdToMint}
//                     />                              
//                 </div> 
//                 <div className="pr-[212px] border-2 border-green-400 flex flex-row flex-wrap items-start">
//                     {/* 
//                         this button is being disabled whenever someone has minted at least one token. 
//                         this is correct for free mints where mint cap per wallet = 1, but is incorrect for
//                         paid mints where users can mint unlimited quantity
//                     */}
//                     <div className="w-full flex flex-row items-center pt-[16px] mb-[19px]">
//                         <button 
//                         disabled={numMinted > 0 || (isSuccess && !mintExistingLoading && !isLoading) ? true : false}
//                         onClick={()=>handleMintInteraction?.()} className={`${isLoading || mintExistingLoading ? "bg-black text-white" : ""} disabled:cursor-default focus:bg-black focus:text-white text-center min-h-[39px] min-x-[158px] h-[39px] w-[158px] text-[12px] border-[1px] border-black font-[helvetica] rounded-[35px]   hover:cursor-pointer`}>
//                             {collectButtonContent} 
//                         </button>                    
//                         <div className="ml-[23px] text-black font-IBMPlexMono">
//                             {totalSupply}&nbsp;minted
//                         </div>
//                     </div>              
//                 </div>                    
//             </div>                                  
//         </div>
//     </div>
// )
// }