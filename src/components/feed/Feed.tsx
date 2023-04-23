// @ts-nocheck
import { Listing } from './Listing'
import { useCurationData } from "../../providers/CurationDataProvider";

export default function Feed() {

    const { listed, updated, parsed } = useCurationData();
    const keys = Object.keys(parsed);

    console.log("parsed :", parsed)

    return (
        <section id="main-feed" className='bg-[#FFFFFF] pl-[16px] pt-20 pb-4 h-full sm:w-full'>
            <div className="grid grid-cols-1 gap-4 ">        
                {keys.map((key) => (
                    <Listing
                        key={key}
                        index={key}
                        metadata={parsed[key]}
                        collection={key}
                    />
                ))}                
            </div>            
        </section>
    )
}