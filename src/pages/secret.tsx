// @ts-nocheck
import useMintNew from '../hooks/useMintNew';
import useMintWithData from '../hooks/useMintWithData';
import { useState } from 'react';

const junghwan_eth = "0x4C53C6D546C9E38db56040Ab505460A9187A5281"
const tranqui_eth = "0x806164c929Ad3A6f4bd70c2370b3Ef36c64dEaa8"

function Secret() {

    const [mintNewConfig, setMintNewConfig] = useState({
        recipients: [junghwan_eth, tranqui_eth],
        quantity: "1",
        tokenLogic: "0x7Bc662793a16769777172A3a2c029A16BdC7E038",
        tokenLogicInit: {
            initialAdmin: "0x153D2A196dc8f1F6b9Aa87241864B3e4d4FEc170",
            mintExistingStartTime: "0",
            mintExistingPrice: "0"
        },
        tokenRenderer: "0x0a2bAD624b74b0093fDcFe22C447294b2c512e48",
        tokenRendererInit: {
            // tokenURI: tokenURI ? tokenURI : ""
            tokenURI: "ipfs://bafkreid3izwzpsw7c6eja7qe4fsigsezroxpewvklvtopdakrxj42geyse"
        },
        fundsRecipient: "0x153D2A196dc8f1F6b9Aa87241864B3e4d4FEc170",
        royaltyBPS: "0",
        primarySaleFeeRecipient: "0x153D2A196dc8f1F6b9Aa87241864B3e4d4FEc170",
        primarySaleFeeBPS: "0",
        soulbound: "false"
    })    

    const {
        write,
        writeAsync,
        data,
        isError,
        isLoading,
        isSuccess,
        status,
        tokenIdMinted,
      } = useMintNew({ mintNewConfig });  
      
      const [mintWithDataConfig, setMintWithDataConfig] = useState({
        // curatedAddress not calculated in state
        selectedTokenId: "25",
        // curator address not calculated in state
        curatorTargetType: 4, // (1 = nft contract, 3 = curation contract, 4 = nft item)
        sortOrder: 0,
        hasTokenId: true,
        chainId: 5    
      })
      
      const {
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
      } = useMintWithData({
        mintWithDataConfig: mintWithDataConfig,
        tokenToCurate: "25"
      })        


  return (
    <div className="flex flex-row justify-center items-center flex-wrap h-100vh w-full">
       <div className='pt-20 flex flex-row flex-wrap w-full justify-center'>
            <button onClick={()=>write?.()}className="w-fit px-4 py-2 border-black border-[1px] hover:bg-black hover:text-white">
                Mint
            </button>
            <button onClick={()=>curationWrite?.()}className="ml-2 w-fit px-4 py-2 border-black border-[1px] hover:bg-black hover:text-white">
                Curate
            </button>            
        </div> 
    </div>
  );
}

export default Secret;
