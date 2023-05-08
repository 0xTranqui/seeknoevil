
import { erc721PressFactory_abi } from "../contracts/erc721PressFactory_abi";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import { BigNumber } from "ethers";

type Props = {
    channelName: string,
    initialOwner: string,
    logicInit: string,
    onSuccessCB?: Function
};

export function useCreate721Press({channelName, initialOwner, logicInit, onSuccessCB }: Props) {

    const ap721PressFactory = process.env.NEXT_PUBLIC_AP_ERC721_FACTORY_PROXY_SEPOLIA ? process.env.NEXT_PUBLIC_AP_ERC721_FACTORY_PROXY_SEPOLIA : ""
    const curationLogic = process.env.NEXT_PUBLIC_AP_CURATION_LOGIC_SEPOLIA ? process.env.NEXT_PUBLIC_AP_CURATION_LOGIC_SEPOLIA : ""
    const curationRenderer = process.env.NEXT_PUBLIC_AP_CURATION_RENDERER_SEPOLIA ? process.env.NEXT_PUBLIC_AP_CURATION_RENDERER_SEPOLIA : ""
    const configuration = {
        fundsRecipient: "0x0000000000000000000000000000000000000000" as `0x${string}`,
        primarySaleFeeRecipient: "0x0000000000000000000000000000000000000000" as `0x${string}`,
        maxSupply: BigNumber.from("18446744073709551615"),
        royaltyBPS: 0,
        primarySaleFeeBPS: 0,
    }

    const channelNameInput = channelName ? channelName : ""
    const initialOwnerInput = initialOwner ? initialOwner : ""
    const logicInitInput = logicInit ? logicInit : ""

    const validTxn = !channelNameInput || !initialOwnerInput || !logicInitInput ? false : true   

    const { config, error } = usePrepareContractWrite({
        address: ap721PressFactory as `0x${string}`, 
        abi: erc721PressFactory_abi,
        functionName: "createPress",
        args: [
            channelNameInput,
            "DEFAULT",
            initialOwnerInput as `0x${string}`,
            curationLogic as `0x${string}`,
            logicInitInput as `0x${string}`,
            curationRenderer as `0x${string}`,
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            true,
            configuration            
        ],
        enabled: validTxn,
    })
    
    console.log("create channel prep config error", error)

    const { 
        write,
        data,
        error: writeError,
        isError,
        isLoading,
        isSuccess,
        status
    } = useContractWrite(config)      

    // Wait for data from createChannel call
    const { data: createChannelData, isLoading: createChannelLoading } = useWaitForTransaction({
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
        createChannelData,
        createChannelLoading
    }
}

export default useCreate721Press