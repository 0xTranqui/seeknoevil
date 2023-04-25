// @ts-nocheck
import  { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

type Props = {
    collectionAddress: string,
    tokenId: string
};

const useNumMinted = ({ collectionAddress, tokenId }: Props) => {

    const { address } = useAuth()
    const userAddress = address ? address : "0x0000000000000000000000000000000000000000"
    const [numMinted, setNumMinted] = useState("0")

    const fetchNumMinted = async () => {
        if (!collectionAddress || !tokenId) {
            return
        }                
        fetch(`https://goerli.ether.actor/${collectionAddress}/numMinted/${tokenId}/${userAddress}`)   
            .then(response => response.text())
            .then((data) => {
                console.log("num minted = ", data)
                setNumMinted(data)
            })
        return
    }    

    // run fetchNumMinted fetch on any change to userAddress
    useEffect(() => {
        fetchNumMinted()        
    },
    [userAddress, collectionAddress, tokenId]
    )   

    return { numMinted, fetchNumMinted }
};

export default useNumMinted;
