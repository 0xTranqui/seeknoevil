import { useState, useEffect } from 'react';
import { BasementSDK } from "@basementdev/sdk";

type Props = {
    address: string
};

const useENSResolver = ({ address }: Props) => {

    const [resolvedAddress, setResolvedAddress] = useState("")

    const sdk = new BasementSDK({
        apiKey: process.env.API_KEY,
        endpoint: "https://beta.basement.dev/v2/graphql",
    });

    const getAddress = async () => {
        const data = await sdk.address({
            address: address,
            include: { reverseProfile: true },
        });
        if (data?.reverseProfile?.name) {
            return data?.reverseProfile?.name
        }
        return null
    }

    // run getAddress fetch on any change to address
    useEffect(() => {
        // Only call getAddress if address is not null
        if (address) {
            //@ts-ignore
            getAddress().then((fetchedData) => {
                // Only call setResolvedAddress if fetchedData is not null
                if (fetchedData) {
                    setResolvedAddress(fetchedData);
                }
            });
        }        
    },
    [address]
    )   

    return resolvedAddress
};

export default useENSResolver;
