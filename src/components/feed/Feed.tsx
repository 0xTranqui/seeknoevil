// @ts-nocheck
import { Listing } from './Listing'
import { useCurationData } from "../../providers/CurationDataProvider";

export default function Feed() {

    const { listed, updated, parsed } = useCurationData();
    const keys = Object.keys(parsed);

    console.log("parsed :", parsed)

    return (
        <section id="main-feed" className='px-4 pt-20 pb-4 h-full w-full justify-center'>
            <div className="grid grid-cols-1 gap-4">        
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