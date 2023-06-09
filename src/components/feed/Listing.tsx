// @ts-nocheck
// import Image from "next/legacy/image";
import Image from "next/image";
import Link from 'next/link';

export const Listing = ({index,  metadata, collection}: any) => {

    const title = metadata && metadata?.title
    const author = metadata && metadata?.contract.contractDeployer

    const convertDate = (date) => {
        const dateObj = new Date(date)
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options).toLowerCase();
        return formattedDate
    }        
    const publicationDate = metadata && convertDate(metadata?.timeLastUpdated)    

    return (
        <>
        {!metadata || !collection ? (
            // TODO: maybe add a loading state instead here?
            <div></div>            
        ) : (
            <div className="relative flex flex-col w-full text-[15px] border-b-[0.5px] border-black pb-[12px]">
                <div className="w-[352px] h-full sm:h-[465px] sm:w-full relative mb-[4px]">
                    <Link href={`/${index}`}>
                        <Image
                            src={metadata?.media[0]?.gateway}
                            fill
                            className="object-contain object-left"

                        />
                    </Link>
                </div>
                <div className="flex flex-row items-start flex-wrap w-full break-words">
                    <b>{metadata?.title}</b>
                    &nbsp;{publicationDate}
                </div>  
            </div>
        )}
        </>
    )
}