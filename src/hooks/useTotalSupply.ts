// @ts-nocheck
import  { useState, useEffect } from 'react';

type Props = {
    collectionAddress: string,
    tokenId: string
};

const useTotalSupply = ({ collectionAddress, tokenId }: Props) => {

    const [totalSupply, setTotalSupply] = useState("0")

    const fetchTotalSupply = () => {        
        if (!collectionAddress || !tokenId) {
            return
        }                
        fetch(`https://goerli.ether.actor/${collectionAddress}/totalSupply/${tokenId}`)   
            .then(response => response.text())
            .then((data) => {
                setTotalSupply(data)
            })
        return
    }    

    // run totalSupply fetch on page load
    useEffect(() => {
        fetchTotalSupply()        
    },
    [collectionAddress, tokenId]
    )   

    return { totalSupply, fetchTotalSupply }
};

export default useTotalSupply;
