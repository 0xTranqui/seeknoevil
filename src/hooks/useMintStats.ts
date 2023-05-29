import { useAuth } from './useAuth';
import { useContractReads } from "wagmi";
import { BigNumber } from 'ethers';
import { erc1155Press_abi } from '../contracts/erc1155Press_abi';

type Props = {
    collectionAddress: `0x${string}` | undefined;
    tokenId: string;
};

const useMintStats = ({ collectionAddress, tokenId }: Props) => {
    const { address } = useAuth();
    const userAddress: `0x${string}` = address
    ? address
    : '0x0000000000000000000000000000000000000000';
    const collection: `0x${string}` = collectionAddress
    ? collectionAddress
    : '0x0000000000000000000000000000000000000000';    

    const contractCalls = [
        {
            address: collection,
            abi: erc1155Press_abi,
            functionName: "numMinted",
            args: [tokenId ? BigNumber.from(tokenId) : BigNumber.from(0), userAddress]
        },
        {
            address: collection,
            abi: erc1155Press_abi,
            functionName: "totalSupply",
            args: [tokenId ? BigNumber.from(tokenId) : BigNumber.from(0)]     
        },            
    ];

    const {
        data: collectionReadData,
        isError: collectionReadError,
        isLoading: collectionReadLoading,
        error: collectionError
    } = useContractReads({
        contracts: contractCalls,
        enabled: !collection || !tokenId ? false : true
    });

    const userNumMinted = collectionReadData ? collectionReadData[0]?.toString() : 0
    const tokenTotalSupply = collectionReadData ? collectionReadData[1]?.toString() : 0

    return { userNumMinted, tokenTotalSupply }
};

export default useMintStats;