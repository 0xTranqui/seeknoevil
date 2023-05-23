// @ts-nocheck
import { Listing } from './Listing'
import { useCurationData } from "../../providers/CurationDataProvider";

export default function Feed() {

    const { listed, updated, parsed } = useCurationData();
    const keys = Object.keys(parsed);

    return (
        <section id="main-feed" className='flex flex-row bg-[#FFFFFF] pl-[16px] pt-20 pb-14 min-h-[120vh] w-[352px] sm:w-full'>
            <div className="grid grid-cols-1 gap-4 h-auto w-full">        
                {keys.slice().reverse().map((key) => (
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