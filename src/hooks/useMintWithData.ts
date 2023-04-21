// @ts-nocheck

import { erc721Press_abi } from "../contracts/erc721Press_abi";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import {useAuth} from "../hooks/useAuth"
import { useState } from "react";
import { utils } from "ethers";

export function useMintWithData({mintWithDataConfig, tokenToCurate}: any) {

    const { address } = useAuth()

    const msgSender = address ? address : ""

    const ap721Press = process.env.NEXT_PUBLIC_AP_721_CURATION_CONTRACT ? process.env.NEXT_PUBLIC_AP_721_CURATION_CONTRACT : ""
    const ap1155Press = process.env.NEXT_PUBLIC_AP_1155_CONTRACT ? process.env.NEXT_PUBLIC_AP_1155_CONTRACT : ""
    
    const mintingConfig = mintWithDataConfig ? mintWithDataConfig : null

    const validMint = !mintingConfig || !tokenToCurate ? false : true

    console.log("is token coming through? ", tokenToCurate)
    
    console.log("valid mint: ", validMint)

    console.log("mintingConfig", mintingConfig)

    // mintWithData contract call flow
    // currently only allows for minting one at a time

    const dataForMint: any = validMint ? utils.defaultAbiCoder.encode(        
        ["(address, uint96, address, int32, uint16, uint16, bool)[]"],
        [
            // first brackets define that this is a tuple
            [
                // inner brackets necessary because param is an array of structs
                [
                    ap1155Press,
                    tokenToCurate,
                    msgSender,
                    mintingConfig.sortOrder,
                    mintingConfig.chainId,
                    mintingConfig.curatorTargetType,            
                    mintingConfig.hasTokenId,
                    
                ]
            ]
        ]
    ) : ""

    console.log("data for curation mint: ", dataForMint)

    const { config: curationConfig, error: curationError } = usePrepareContractWrite({
        address: ap721Press,
        abi: erc721Press_abi,
        functionName: "mintWithData",
        args: [
            1, // quantity
            dataForMint
        ],
        enabled: validMint == true ? true : false,
        // overrides: {} // msg.value hardcoded as zero for no but should be dynamic based on prior read call
    })

    console.log("curation prep config", curationConfig)
    console.log("curaiton prep config error", curationError)

    const { 
        write: curationWrite,
        data: curationData,
        isError: curationIsError,
        isLoading: curationIsLoading,
        isSuccess: curationIsSuccess,
        status: curationStatus
    } = useContractWrite(curationConfig)      

    console.log("curationData: ", curationData)

    // Wait for data from bid call
    const { data: mintWaitData, isLoading: mintWaitLoading } = useWaitForTransaction({
        hash:  curationData?.hash,
        onSuccess(mintWaitData) {
            console.log("txn complete: ", mintWaitData)
            console.log("txn hash: ", mintWaitData.transactionHash)
        }
    })           

    return {
        curationConfig,
        curationError,
        curationWrite,
        curationData,
        curationIsError,
        curationIsLoading,
        curationIsSuccess,
        curationStatus,
        mintWaitData,
        mintWaitLoading
    }
}

export default useMintWithData