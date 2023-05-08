// @ts-nocheck
import useMintNew from '../hooks/useMintNew';
import useMintWithData from '../hooks/useMintWithData';
import { useState } from 'react';

const junghwan_eth = "0x4C53C6D546C9E38db56040Ab505460A9187A5281"
const tranqui_eth = "0x806164c929Ad3A6f4bd70c2370b3Ef36c64dEaa8"
const devtest_eth = "0xF2365A26f766109b5322B0f90d71c21bF32bda04"

function Secret() {

    const [mintNewConfig, setMintNewConfig] = useState({
        recipients: [junghwan_eth, tranqui_eth, devtest_eth],
        quantity: "1",
        tokenLogic: "0x7218E2714d1C29FBda6E528F6b65E1216Cd2a73A",
        tokenLogicInit: {
            initialAdmin: "0x153D2A196dc8f1F6b9Aa87241864B3e4d4FEc170",
            mintExistingStartTime: "0",
            mintExistingPrice: "0"
        },
        tokenRenderer: "0x4E1AD7A0D2e25Fb80AE8B18aFc90243C07f4aED9",
        tokenRendererInit: {
            // tokenURI: tokenURI ? tokenURI : ""
            tokenURI: "ipfs://bafkreidnryk3kzqhderb6frvcveo53ix5yv5izn5ikce7364yqtuvaamfu"
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
        selectedTokenId: "2",
        // curator address not calculated in state
        curatorTargetType: 4, // (1 = nft contract, 3 = curation contract, 4 = nft item)
        sortOrder: 0,
        hasTokenId: true,
        chainId: 11155 //incorrect chain id for sepolia to stay inside uint16 lmit    
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
        tokenToCurate: "2"
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
