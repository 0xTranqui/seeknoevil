// @ts-nocheck
import Image from "next/image";
import { EnsResolution } from '../../utils/ensResolution';
// import { ensResolution } from '../../utils/';

export const Listing = ({index,  metadata, collection}: any) => {

    // console.log("index", index)
    // console.log("metadata", metadata)
    // console.log("collection", collection)

    return (
        <>
        {!metadata || !collection ? (
            // TODO: maybe add a loading state instead here ?
            <div></div>            
        ) : (
            <div className="relative flex flex-row items-start flex-wrap w-full max-w-full text-[14px] border-b-[1px] border-black pb-[12px]">
                <div className="overflow-hidden relative w-full sm:w-[340px] sm:h-[191px] aspect-video mb-[4px]">
                    <Image
                        src={metadata?.media[0]?.thumbnail}
                        fill
                    />
                </div>
                <div className="flex flex-row items-start flex-wrap w-full break-words">
                    <b>{metadata?.contract.name}</b>
                    &nbsp;{'April 4, 2023'}
                </div>                                                                                                                                  
            </div>
        )}
        </>
    )
}