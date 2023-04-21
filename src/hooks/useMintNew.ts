// @ts-nocheck

import { erc1155Press_abi } from "../contracts/erc1155Press_abi";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractEvent } from "wagmi";
import { utils } from "ethers"
import { useState } from "react";

const junghwan_eth = "0x4C53C6D546C9E38db56040Ab505460A9187A5281"
const tranqui_eth = "0x806164c929Ad3A6f4bd70c2370b3Ef36c64dEaa8"

export function useMintNew({mintNewConfig}: any) {

    const [tokenIdMinted, setTokenIdMinted] = useState("")

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
    
    console.log("prep config error", error)

    const { 
        write,
        data,
        error: writeError,
        isError,
        isLoading,
        isSuccess,
        status
    } = useContractWrite(config)      

    console.log("writeError: ", writeError)
    console.log("mintNew data: ", data)

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
            setTokenIdMinted(tokenId.toString())
            console.log(
                "tokenId, sender, recipient", "quantity",
                tokenId,
                sender,
                recipient,
                quantity
            )
        },
        // Receive only a single event, then stop listener
        once: true,
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
        mintNewData,
        mintNewLoading,
        tokenIdMinted
    }
}

export default useMintNew