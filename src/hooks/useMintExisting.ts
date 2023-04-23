// @ts-nocheck

import { erc1155Press_abi } from "../contracts/erc1155Press_abi";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";

type Props = {
    tokenId: string,
    userAddress: string,
    onSuccessCB?: Function
};

export function useMintExisting({tokenId, userAddress, onSuccessCB }: Props) {

    const ap1155Press = process.env.NEXT_PUBLIC_AP_1155_CONTRACT ? process.env.NEXT_PUBLIC_AP_1155_CONTRACT : ""

    const validMint = !tokenId || !userAddress ? false : true 

    const { config, error } = usePrepareContractWrite({
        address: ap1155Press,
        abi: erc1155Press_abi,
        functionName: "mintExisting",
        args: [
            tokenId,
            [userAddress], // mint recipient
            1 // mint quantity always hardcoded to 1
        ],
        enabled: validMint
        // overrides: {} // hardcoded as zero for no but could also be dynamic based on prior read call
    })
    
    console.log("prep config error", error)

    const { 
        write,
        data,
        error: writeError,
        isError,
        isLoading,
        isSuccess,
        status
    } = useContractWrite({
        ...config,
        onSuccess(data) {
            if (!!onSuccessCB) {
                onSuccessCB?.()
            } else {
                return
            }
        }
    })      

    console.log("writeError: ", writeError)
    console.log("mintExisting data: ", data)

    // Wait for data from mintExisting call
    const { data: mintExistingData, isLoading: mintExistingLoading } = useWaitForTransaction({
        hash:  data?.hash,
        onSuccess(mintExistingData) {
            console.log("txn complete: ", mintExistingData)
            console.log("txn hash: ", mintExistingData.transactionHash)
        }
    })           

    return {
        config,
        error,
        write,
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