
import { erc1155PressFactory_abi } from "../contracts/erc1155PressFactory_abi";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";

type Props = {
    channelName: string,
    channelSymbol: string,
    initialOwner: string,
    logicInit: string,
    onSuccessCB?: Function
};

export function useCreate1155Press({channelName, channelSymbol, initialOwner, logicInit, onSuccessCB }: Props) {

    const ap1155PressFactory = process.env.NEXT_PUBLIC_AP_ERC1155_FACTORY_PROXY_SEPOLIA ? process.env.NEXT_PUBLIC_AP_ERC1155_FACTORY_PROXY_SEPOLIA : ""
    
    const editionContractLogic = process.env.NEXT_PUBLIC_AP_EDITION_CONTRACT_LOGIC_SEPOLIA ? process.env.NEXT_PUBLIC_AP_EDITION_CONTRACT_LOGIC_SEPOLIA : ""
    const channelNameInput = channelName ? channelName : ""
    const channelSymbolInput = channelSymbol ? channelSymbol : ""
    const initialOwnerInput = initialOwner ? initialOwner : ""
    const logicInitInput = logicInit ? logicInit : ""

    const validTxn = !channelNameInput || !initialOwnerInput || !logicInitInput ? false : true   

    const { config, error } = usePrepareContractWrite({
        address: ap1155PressFactory as `0x${string}`, 
        abi: erc1155PressFactory_abi,
        functionName: "createPress",
        args: [
            channelNameInput,
            channelSymbolInput,
            initialOwnerInput as `0x${string}`,
            editionContractLogic as `0x${string}`,
            logicInitInput as `0x${string}`        
        ],
        enabled: validTxn,
    })
    
    console.log("create collection prep config error", error)

    const { 
        write,
        data,
        error: writeError,
        isError,
        isLoading,
        isSuccess,
        status
    } = useContractWrite(config)      

    // Wait for data from createCollection call
    const { data: createCollectionData, isLoading: createCollectionLoading } = useWaitForTransaction({
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
        createCollectionData,
        createCollectionLoading
    }
}

export default useCreate1155Press