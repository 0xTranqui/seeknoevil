// @ts-nocheck
import { erc721Press_abi } from "../contracts/erc721Press_abi";
import { erc1155Press_abi } from "../contracts/erc1155Press_abi";
import {usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractEvent } from "wagmi";
import { ethers, utils, BigNumber } from "ethers"
import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

export function useMintAndCurate({mintNewConfig}: any) {

    const [tokenIdMinted, setTokenIdMinted] = useState(0)

    const {address} = useAuth()

    const ap721Press = process.env.NEXT_PUBLIC_AP_721_CURATION_CONTRACT ? process.env.NEXT_PUBLIC_AP_721_CURATION_CONTRACT : ""
    const ap1155Press = process.env.NEXT_PUBLIC_AP_1155_CONTRACT ? process.env.NEXT_PUBLIC_AP_1155_CONTRACT : ""
    
    const mintingConfig = mintNewConfig ? mintNewConfig : null

    const validMint = !mintingConfig || !mintNewConfig.tokenRendererInit.tokenURI ? false : true

    console.log("valid mint: ", validMint)

    const { config, error } = usePrepareContractWrite({
        address: ap1155Press,
        abi: erc1155Press_abi,
        functionName: "mintNew",
        args: [
            mintNewConfig.recipients,
            mintNewConfig.quantity,
            mintNewConfig.tokenLogic,
            utils.defaultAbiCoder.encode(
                ["address", "uint256", "uint256"],
                [
                    mintNewConfig.tokenLogicInit.initialAdmin,
                    mintNewConfig.tokenLogicInit.mintExistingStartTime,
                    mintNewConfig.tokenLogicInit.mintExistingPrice
                ]
            ),
            mintNewConfig.tokenRenderer,
            utils.defaultAbiCoder.encode(
                ["string"],
                [mintNewConfig.tokenRendererInit.tokenURI]
            ),
            mintNewConfig.fundsRecipient,
            mintNewConfig.royaltyBPS,
            mintNewConfig.primarySaleFeeRecipient,
            mintNewConfig.primarySaleFeeBPS,
            mintNewConfig.soulbound
        ],
        enabled: validMint == true ? true : false
        // enabled: mintAccess,
        // overrides: {} // hardcoded as zero for no but should be dynamic based on prior read call
    })
    
    console.log("prep config:", config)

    console.log("prep config error", error)

    const { 
        write,
        writeAsync,
        data,
        error: writeError,
        isError,
        isLoading,
        isSuccess,
        status
    } = useContractWrite(config)      

    console.log("writeError: ", writeError)

    // Wait for data from mintNew call
    const { data: mintNewData, isLoading: mintNewLoading } = useWaitForTransaction({
        hash:  data?.hash,
        onSuccess(mintNewData) {
            console.log("txn complete: ", mintNewData)
            console.log("txn hash: ", mintNewData.transactionHash)
        }
    })           

    useContractEvent({
        address: ap1155Press,
        abi: erc1155Press_abi,
        eventName: "NewTokenMinted",
        listener(tokenId, sender, recipient, quantity) {
            setTokenIdMinted(tokenId)
        },
        // Receive only a single event, then stop listener
        once: true,
    })    

    const { config: curationConfig, error: curationError } = usePrepareContractWrite({
        address: ap721Press,
        abi: erc721Press_abi,
        functionName: "mintWithData",
        args: [
            1, // quantity
            utils.defaultAbiCoder.encode(        
                ["(address, uint96, address, int32, uint16, uint16, bool)[]"],
                [
                    // first brackets define that this is a tuple
                    [
                        // inner brackets necessary because param is an array of structs
                        [
                            process.env.NEXT_PUBLIC_AP_1155_CONTRACT, // address to curate
                            BigNumber.from(tokenIdMinted), // selected token Id
                            address, // curator
                            0, // "sort order"
                            11155, // "chainId",
                            4, // curationTarget type
                            true // hasTokenId
                        ]
                    ]
                ]
            )
        ],
        enabled: tokenIdMinted != 0
        // overrides: {} // msg.value hardcoded as zero for no but should be dynamic based on prior read call
    })    

    const { 
        write: curationWrite,
        writeAsync: curationWriteAsync,
        data: curationData,
        isError: curationIsError,
        isLoading: curationIsLoading,
        isSuccess: curationIsSuccess,
        status: curationStatus
    } = useContractWrite(curationConfig)   
    
    const { data: mintWaitData, isLoading: mintWaitLoading } = useWaitForTransaction({
        hash:  curationData?.hash,
        onSuccess(mintWaitData) {
            console.log("txn complete: ", mintWaitData)
            console.log("txn hash: ", mintWaitData.transactionHash)
        }
    })        

    const [hasCurated, setHasCurated] = useState(false);

    useEffect(() => {
        if (tokenIdMinted !== 0 && curationWrite && !hasCurated) {
            console.log("tokenId minted right before write is called", tokenIdMinted);
            curationWrite();
            setHasCurated(true);
        }
    }, [tokenIdMinted, curationWrite]);

    return {
        // mintNew returns
        config,
        error,
        write,
        data,
        isError,
        isLoading,
        isSuccess,
        status,
        mintNewData,
        mintNewLoading,
        // mintWithData returns
        curationConfig,
        curationError,
        curationWrite,
        curationWriteAsync,
        curationData,
        curationIsError,
        curationIsLoading,
        curationIsSuccess,
        curationStatus,
        mintWaitData,
        mintWaitLoading
    }
}

export default useMintAndCurate