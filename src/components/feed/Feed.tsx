// @ts-nocheck
import { useState, useEffect } from 'react';
import { Network, Alchemy } from 'alchemy-sdk';
import { Listing } from './Listing'

export default function  Feed({curationContract}: string) {

    // hardcoding curation contract to fetch
    const contract: string = curationContract ? curationContract : "0x0000000000000000000000000000000000000000"

    // state
    const [curationMetadata, setCurationMetadata] = useState();
    const [lastUpdated, setLastUpdated] = useState()
    const [parsedMetadata, setParsedMetadata] = useState();
    
    // util function
    const convertDate = (date) => {
        const dateObj = new Date(date)
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options).toLowerCase();
        return formattedDate
    }    
    
    // dynamic values set on useEffect
    const listed = curationMetadata ? curationMetadata.nfts : []
    const updated = lastUpdated ? convertDate(lastUpdated) : "mm/yy/dd/ss"
    const parsed = parsedMetadata ? parsedMetadata : []
    
    // Initializing Alchemy indexer configs
    const alchemy_setting_goerli = {
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY_GOERLI,
        network: Network.ETH_GOERLI,
    };
    const alchemy_settings_mainnet = {
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY_MAINNNET,
        network: Network.ETH_MAINNET, 
    };      

    // Initializing Alchemy indexer instances
    const alchemyGoerli = new Alchemy(alchemy_setting_goerli);
    const alchemyMainnet = new Alchemy(alchemy_settings_mainnet);    

    const parseMetadata = async (metadata: any) => {
        let parsedNFTs = []
        for (let i = 0; i < metadata.nfts.length; i++) {
            let nftData = await alchemyMainnet.nft.getNftMetadata(metadata.nfts[i].rawMetadata.properties.contract, "1")
            parsedNFTs.push(nftData)
        }
        setParsedMetadata(parsedNFTs)
    }    

    const getMetadata = async () => {
        const curationInfo: any = await alchemyGoerli.nft.getNftsForContract(contract)
        setCurationMetadata(curationInfo);
        setLastUpdated(curationInfo?.nfts[curationInfo?.nfts.length-1]?.timeLastUpdated)        
        await parseMetadata(curationInfo) 
    }    

    useEffect(() => {
        if(!!contract) {
            getMetadata();
        }    
        },
        []
    )        

    return (
        <section id="main-feed" className='px-4 pt-20 pb-4 h-full w-full justify-center'>
            <div className="grid grid-cols-1 gap-4">        
                {listed.map((collection: any, index) => (
                    <Listing
                        key={index}
                        index={index}
                        metadata={parsed[index]}
                        collection={collection}
                    />
                ))}
            </div>            
        </section>
    )
}