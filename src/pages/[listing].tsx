// @ts-nocheck

import { NextPage } from 'next'
import { useRouter } from "next/router";
import { useCurationData } from "../providers/CurationDataProvider";
import MarkdownViewer from '../components/markdown/MarkdownViewer';
import { shortenAddress } from '../utils/shortenAddress';
import useMintExisting from '../hooks/useMintExisting';
import { useAuth } from '../hooks/useAuth';

const ListingPage: NextPage = () => {
    const router = useRouter(); 
    const { listing } = router.query;
    const listingId: any = listing ? listing : ""
    const { listed, updated, parsed } = useCurationData();
    const { address } = useAuth()

    const tokenIdToMint = parsed && parsed[listingId]?.tokenId;

    const userAddress = address ? address : null

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
        userAddress: userAddress
    })

    // state for loading txns
    const svgLoader = () => {
        return (
            <div className="flex flex-row justify-center items-center w-full fill-black ">
                <img
                className='fill-black'
                width="20px"
                src="/SVG-Loaders/svg-loaders/tail-spin.svg"
                />
            </div>
        )
    }    

    const collectSpinner = isLoading || mintExistingLoading
        ? svgLoader()
        : "Collect"     

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
        <div className="flex flex-row flex-wrap  bg-[#FFFFFF] min-h-[100vh] px-4 pt-10 pb-[108px] h-full w-full justify-center ">
            <div className='w-[660px] pt-[155px]'>
                <div className="font-[helvetica] flex flex-row w-full justify-start text-[22px] font-normal">
                    {title}
                </div>
                <div className="font-[helvetica] flex flex-row w-full justify-start text-[15px] mt-[68px]">
                    <div className="font-[helvetica] font-bold">{shortenAddress(author)}</div>&nbsp;{publicationDate}
                </div>            
                {ipfsPath && (
                    <MarkdownViewer ipfsPath={ipfsPath} />
                )}
                <button onClick={()=>write?.()} className="text-center min-h-[46px] min-x-[97px] h-[46px] w-[97px] text-[12px] border-[1px] border-black font-[helvetica] rounded-[35px]   hover:cursor-pointer">
                    {collectSpinner} 
                </button>
            </div>
        </div>
    )
}

export default ListingPage;  