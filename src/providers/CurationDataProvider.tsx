// @ts-nocheck

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Network, Alchemy } from 'alchemy-sdk';

interface CurationDataType {
  contract: string;
  listed: any[];
  updated: string;
  parsed: any[];
}

const CurationDataContext = createContext<CurationDataType | undefined>(undefined);

interface CurationDataProviderProps {
  children: ReactNode;
  curationContract?: string;
}

export function CurationDataProvider({ children, curationContract }: CurationDataProviderProps) {
  
  // hardcoding curation contract to fetch
  const contract: string = curationContract ? curationContract : "0x0000000000000000000000000000000000000000";

  // state
  const [curationMetadata, setCurationMetadata] = useState();
  const [lastUpdated, setLastUpdated] = useState();
  const [parsedMetadata, setParsedMetadata] = useState();

    // util function
    const convertDate = (date) => {
        const dateObj = new Date(date)
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options).toLowerCase();
        return formattedDate
    }    
    // Initializing Alchemy indexer configs
    const alchemy_setting_goerli = {
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY_GOERLI,
        network: Network.ETH_GOERLI,
    };
    const alchemy_settings_mainnet = {
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY_MAINNNET,
        network: Network.ETH_MAINNET, 
    };      

    // Initializing Alchemy indexer instances
    const alchemyGoerli = new Alchemy(alchemy_setting_goerli);
    const alchemyMainnet = new Alchemy(alchemy_settings_mainnet);    

    const parseMetadata = async (metadata: any) => {
      let parsedNFTs = {}
      for (const [key, value] of Object.entries(metadata)) {
        let nftData = await alchemyMainnet.nft.getNftMetadata(value.rawMetadata.properties.contract, "1") 
        parsedNFTs[key] = nftData
      }
      setParsedMetadata(parsedNFTs)
    }        

    const getMetadata = async () => {
      const curationInfo: any = await alchemyGoerli.nft.getNftsForContract(contract)
      let taggedData = {}
        for (let i = 0; i < curationInfo.nfts.length; i++) {
          const tokenId = curationInfo.nfts[i].tokenId;
          taggedData[tokenId] = curationInfo.nfts[i];
      }      
      // set curation metadata to state
      setCurationMetadata(taggedData)
      // create array of keys so as to generate the last entry to find timeLastUpdated
      const keys = Object.keys(taggedData);
      // set lastUpdated value to state
      setLastUpdated(taggedData[keys[keys.length - 1]]?.timeLastUpdated) 
      // run parseMetadata function to get the metadata of the nfts stored in curation receipts
      parseMetadata(taggedData) 
    }    

  useEffect(() => {
    if (!!contract) {
      getMetadata();
    }
  }, []);

  const value = {
    contract,
    listed: curationMetadata ? curationMetadata : [],
    updated: lastUpdated ? convertDate(lastUpdated) : "mm/yy/dd/ss",
    parsed: parsedMetadata ? parsedMetadata : [],
  };

  return <CurationDataContext.Provider value={value}>{children}</CurationDataContext.Provider>;
}

export function useCurationData() {
  const context = useContext(CurationDataContext);

  if (context === undefined) {
    throw new Error("useCurationData must be used within a CurationDataProvider");
  }

  return context;
}
