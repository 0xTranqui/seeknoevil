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

const ListingPage: NextPage = () => {
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
        onSuccessCB: fetchNumMinted
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

    const collectSpinner = isLoading || mintExistingLoading
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

    const convertDate = (date) => {
        const dateObj = new Date(date)
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options).toLowerCase();
        return formattedDate
    }        
    const publicationDate = parsed && convertDate(parsed[listingId]?.timeLastUpdated)

    return (
        <div className="text-[14px] flex flex-row flex-wrap  bg-[#FFFFFF] min-h-[100vh] pt-10 pb-[108px] h-full w-full justify-center ">
            <div className=' w-[370px] sm:w-[500px] md:w-[625px] pt-[125px]'>
                <div className="font-[helvetica] flex flex-row w-full justify-start text-[32px] font-normal">
                    {title}
                </div>
                <div className="font-[helvetica] flex flex-row w-full justify-start text-[15px] mt-[90px]">
                    <div className="font-[helvetica] font-bold">{shortenAddress(author)}</div>&nbsp;{publicationDate}
                </div>            
                {ipfsPath && (
                    <MarkdownViewer ipfsPath={ipfsPath} />
                )}
                <ListingInfo
                    collectionAddress={process.env.NEXT_PUBLIC_AP_1155_CONTRACT}
                    tokenId={tokenIdToMint}
                />
                <div className="w-full flex flex-row mt-[65px] items-center">
                    <button 
                    disabled={isSuccess && !mintExistingLoading && !isLoading ? true : false}
                    onClick={()=>handleMintInteraction?.()} className={`${isLoading || mintExistingLoading ? "bg-black text-white" : ""} disabled:cursor-default focus:bg-black focus:text-white text-center min-h-[46px] min-x-[186px] h-[46px] w-[186px] text-[14px] border-[1px] border-black font-[helvetica] rounded-[35px]   hover:cursor-pointer`}>
                        {collectSpinner} 
                    </button>                    
                    <div className="ml-[23px] text-black font-IBMPlexMono">
                        {numMinted}&nbsp;minted
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListingPage;  