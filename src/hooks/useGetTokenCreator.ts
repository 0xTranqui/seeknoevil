import { ethers, BigNumber } from "ethers"
import { useState, useEffect } from "react";

type Props = {
    providerForQuery: any,
    collection: `0x${string}`,
    tokenId: BigNumber,
};

var eventAbi = ['event NewTokenMinted(uint256 indexed tokenId, address indexed sender, address indexed recipient, uint256 quantity)']  

export function useGetTokenCreator({providerForQuery, collection, tokenId}: Props) {

    const [tokenCreator, setTokenCreator] = useState()
    const [tokenCreated, setTokenCreated] = useState()

    useEffect(() => {
        const getEvents = async () => {
            if (!providerForQuery || !collection || !tokenId) return
            const eventFilter = new ethers.Contract(collection, eventAbi, providerForQuery)            
            let eventFilterNewTokenMinted = eventFilter.filters.NewTokenMinted();
            let startBlock = 3421386; // ERC1155PressFactoryProxy block deploy date 
            let endBlock = 'latest';
            try {
                const newTokenMintedEvents = await eventFilter.queryFilter(
                    eventFilterNewTokenMinted,
                    startBlock,
                    endBlock
                ); 
                console.log("new token minted events", newTokenMintedEvents)           
                for (let i = 0; i < newTokenMintedEvents.length; i++) {
                    // @ts-ignore
                    if (newTokenMintedEvents[i].args[0].toString() == tokenId.toString()) {                        
                        const block = await providerForQuery.getBlock(newTokenMintedEvents[i].blockNumber)
                        // @ts-ignore
                        setTokenCreated(block.timestamp * 1000)
                        // @ts-ignore
                        setTokenCreator(newTokenMintedEvents[i].args[1].toString())
                        return
                    }
                }
            }  catch (e: any) {
                // TODO: add in error handling
            }       
        }
        getEvents()
    }, [providerForQuery, collection, tokenId])

    return {
        tokenCreator,
        tokenCreated
    }
}

export default useGetTokenCreator