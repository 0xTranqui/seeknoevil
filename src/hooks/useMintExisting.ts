import { BigNumber } from "ethers";
import { erc1155Press_abi } from "../contracts/erc1155Press_abi";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";

type Props = {
    collection: `0x${string}`,
    tokenId: BigNumber,
    userAddress: `0x${string}`,
    onSuccessCB?: Function
};

export function useMintExisting({collection, tokenId, userAddress, onSuccessCB }: Props) {

    const validMint = !collection || !tokenId || !userAddress ? false : true 

    const { config, error } = usePrepareContractWrite({
        address: collection,
        abi: erc1155Press_abi,
        functionName: "mintExisting",
        args: [
            tokenId,
            [userAddress], // mint recipient
            BigNumber.from(1) // mint quantity always hardcoded to 1
        ],
        enabled: validMint
        // overrides: {} // hardcoded as zero for no but could also be dynamic based on prior read call
    })    

    const { 
        write,
        data,
        error: writeError,
        isError,
        isLoading,
        isSuccess,
        status
    } = useContractWrite(config)      

    // Wait for data from mintExisting call
    const { data: mintExistingData, isLoading: mintExistingLoading } = useWaitForTransaction({
        hash:  data?.hash,
        onSuccess() {
            if (!!onSuccessCB) {
                onSuccessCB?.()
            } else {
                return
            }            
        }
    })           

    return {
        config,
        error,
        write,
        writeError,
        data,
        isError,
        isLoading,
        isSuccess,
        status,
        mintExistingData,
        mintExistingLoading
    }
}

export default useMintExisting