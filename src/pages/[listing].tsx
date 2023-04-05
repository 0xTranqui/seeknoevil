import { NextPage } from 'next'
import { useRouter } from "next/router";
import { useCurationData } from "../providers/CurationDataProvider";

const ListingPage: NextPage = () => {
    const router = useRouter(); 
    const { listing } = router.query;
    const listingId: any = listing ? listing : "0"

    const { listed, updated, parsed } = useCurationData();

    return (
        <div className="flex flex-row flex-wrap pt-20">
            <div className="flex flex-row w-full">
                This listing is index: {listingId}
            </div>
            <div className="flex flex-row w-full">
                {JSON.stringify(listed)}
            </div>        
            <div className="pt-10 flex flex-row w-full">
                {JSON.stringify(parsed)}
            </div>        
        </div>
    )
}

export default ListingPage;  