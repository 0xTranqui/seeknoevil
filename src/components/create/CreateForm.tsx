// @ts-nocheck

import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { useEditorContext } from '../markdown/context/EditorContext'
import { useMintNew } from '../../hooks/useMintNew'
import { useMintWithData } from '../../hooks/useMintWithData'
import {marked} from 'marked';

const junghwan_eth = "0x4C53C6D546C9E38db56040Ab505460A9187A5281"
const tranqui_eth = "0x806164c929Ad3A6f4bd70c2370b3Ef36c64dEaa8"

const CreateForm = () => {

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
          tokenURI: ""
      },
      fundsRecipient: "0x153D2A196dc8f1F6b9Aa87241864B3e4d4FEc170",
      royaltyBPS: "0",
      primarySaleFeeRecipient: "0x153D2A196dc8f1F6b9Aa87241864B3e4d4FEc170",
      primarySaleFeeBPS: "0",
      soulbound: "false"
  })

  // const {
  //   config,
  //   error,
  //   write,
  //   writeAsync,
  //   data,
  //   isError,
  //   isLoading,
  //   isSuccess,
  //   status,
  //   mintNewData,
  //   mintNewLoading,
  //   tokenIdMinted    
  // } = useMintNew({
  //   mintNewConfig: mintNewConfig
  // })

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

  console.log("tokenIdMinted", tokenIdMinted)

  const [mintWithDataConfig, setMintWithDataConfig] = useState({
    // curatedAddress not calculated in state
    selectedTokenId: "",
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
    tokenToCurate: tokenIdMinted
  })  

  // publishing markdown to ipfs 
  const editorContext = useEditorContext()
  // const [isPublishing, setIsPublishing] = useState(false);
  // const [publishError, setPublishError] = useState(false);
  // const [publishedCid, setPublishedCid] = useState('')

  // handling inputs for tokenMetadata + mint price
  const [tokenMetadata, setTokenMetadata] = useState({
      "name": "",
      "description": "",
      "image": "",
      "animation_url": "",
  })

  const [mintPrice, setMintPrice] = useState(null);

  // dealing with description input in create flow
  const [isDescriptionEdited, setIsDescriptionEdited] = useState(false);

  const handleName = (e) => {
      setTokenMetadata((prevTokenMetadata) => ({
          ...prevTokenMetadata,
          name: e.target.value,
      }));
  };

  const handleDescription = (e) => {
      setIsDescriptionEdited(true);
      setTokenMetadata((prevTokenMetadata) => ({
          ...prevTokenMetadata,
          description: e.target.value,
      }));
  };

  // helper functions for displaying description placeholder
  const truncatePlaceholder = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const markdownToPlainText = (markdown) => {
    const html = marked(markdown);
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };  

  const handleAnimationUrl = (path) => {
    setTokenMetadata((prevTokenMetadata) => ({
        ...prevTokenMetadata,
        animation_url: path,
    }));
  };

  // const handleTokenURI = (uri) => {
  //   setMintNewConfig((prevConfig) => ({
  //       ...prevConfig,
  //       tokenRendererInit: {
  //         tokenURI: uri
  //       }
  //   }));
  // };  

  const handleTokenURI = (tokenURI, callback) => {
    setMintNewConfig((prevConfig) => {
      return {
        ...prevConfig,
        tokenRendererInit: {
          ...prevConfig.tokenRendererInit,
          tokenURI: tokenURI,
        },
      };
    });
    if (callback) {
      console.log("running callback after handleTokenURI")
      callback();
    }
  };  

  // handling image upload
  const [thumbnail, setThumbnail] = useState(null);

  const [uploadLoading, setUploadLoading] = useState(false)

  const inputFileRef = useRef();

  const handleClick = () => {
    inputFileRef.current.click();
  };

  const coverImageUpload = async (file: File) => {
    const imageCID = await editorContext.uploadImage(file)
    console.log("imageCID: ", imageCID)
    setTokenMetadata((prevTokenMetadata) => ({
        ...prevTokenMetadata,
        image: "ipfs://" + imageCID,
    }));
}  

  const handleImageUpload = async (e) => {
    setUploadLoading(true)
    const imageFile = e.target.files[0];
    if (imageFile) {
        await coverImageUpload(imageFile);
        setThumbnail(imageFile)
    }
    setUploadLoading(false)
  };  

  const resetThumbnailImage = () => {
    setThumbnail(null)
  }

  const handleMarkdownUpload = async () => {
    try {
      const cid = await editorContext.publishMarkdown();
      console.log("published markdown cid: ", "ipfs://" + cid)
      const animationUrl = "ipfs://" + cid;
      handleAnimationUrl(animationUrl)
      return animationUrl;
    } catch (err) {
      console.error('Error publishing document', err);
    }
    console.log("what is the state :", tokenMetadata.animation_url)
  }

  const handleMetadataUpload = async (animationUrl) => {

    if (!animationUrl) return

    const updatedTokenMetadata = {
      ...tokenMetadata,
      animation_url: animationUrl,
    };    

    try {
      const jsonString = JSON.stringify(updatedTokenMetadata)
      const jsonBlob = new Blob([jsonString], { type: "application/json" });
      const jsonFile = new File([jsonBlob], "tokenMetadata.json", { type: "application/json", lastModified: Date.now() });
      const cid = await editorContext.uploadTokenMetadata(jsonFile)
      return cid
      console.log("metadata cid: ", cid)
    } catch (err) {
      console.error("Error uploading metadata", err)
    }
  }

  const [minting, setMinting] = useState(false)
  const [publicationSuccess, setPublicationSucess] = useState(false)

  // tbd form submit / mint button?
  const pinAndMint = async () => {
    try {
      const animationUrl = await handleMarkdownUpload();
      // const tokenURI = "ipfs://" + await handleMetadataUpload(animationUrl);
      handleTokenURI("ipfs://" + await handleMetadataUpload(animationUrl))
      // await handleTokenURI(tokenURI)
      write()
    } catch (err) {
      console.error("Error in minting process")
    }
  };

  // const justPin = async () => {
  //   try {
  //     const animationUrl = await handleMarkdownUpload();
  //     const tokenURI = "ipfs://" + await handleMetadataUpload(animationUrl);
  //     console.log("tokenURI")
  //     handleTokenURI(tokenURI)
  //   } catch (err) {
  //     console.error("Error in minting process")
  //   }
  // }

  // const justPin = async () => {
  //   try {
  //     const animationUrl = await handleMarkdownUpload();
  //     const tokenURI = "ipfs://" + await handleMetadataUpload(animationUrl);
  //     console.log("tokenURI");
  //     handleTokenURI(tokenURI, () => {
  //       mintNewToken();
  //     });
  //   } catch (err) {
  //     console.error("Error in minting process");
  //   }
  // };  

  // const justPin = async () => {
  //   try {
  //     const animationUrl = await handleMarkdownUpload();
  //     const tokenURI = "ipfs://" + await handleMetadataUpload(animationUrl);
  //     console.log("tokenURI", tokenURI);
  //     handleTokenURI(tokenURI);
  //     setMintingStep(2);
  //   } catch (err) {
  //     console.error("Error in minting process");
  //     setMintingStep(0);
  //   }
  // };  

  const justPin = async () => {
    try {
      const animationUrl = await handleMarkdownUpload();
      const tokenURI = "ipfs://" + await handleMetadataUpload(animationUrl);
      console.log("tokenURI", tokenURI);
      handleTokenURI(tokenURI, () => {
        mintNewToken();
      });
    } catch (err) {
      console.error("Error in minting process");
    }
  };    


  const mintNewToken = async () => {
    write?.()
    // writeAsync?.()
    setMintWithDataConfig((prevConfig) => ({
      ...prevConfig,
      selectedTokenId: tokenIdMinted
    }));
  }

  const curateMintedToken = async () => {
    curationWrite?.()
    // curationWriteAsync?.()
    setPublicationSucess(true)
  }



  const [mintingStep, setMintingStep] = useState(0);

  const fullPublicationCycle = async () => {
    setMinting(true);
    setMintingStep(1);
  };

  // // Observe mintingStep and trigger justPin when mintingStep is 1
  // useEffect(() => {
  //   if (mintingStep === 1) {
  //     justPin()
  //       .then(() => setMintingStep(2))
  //       .catch((err) => {
  //         console.error("Error in minting process", err);
  //         setMintingStep(0);
  //         setMinting(false);
  //       });
  //   }
  // }, [mintingStep]);

  // Observe mintingStep and trigger justPin when mintingStep is 1
  useEffect(() => {
    if (mintingStep === 1) {
      justPin()
        .then((cid) => {
          if (cid) {
            setMintNewConfig((prevConfig) => {
              return {
                ...prevConfig,
                tokenRendererInit: {
                  ...prevConfig.tokenRendererInit,
                  tokenURI: cid,
                },
              };
            });
            setMintingStep(2);
          } else {
            console.error("Error: No CID returned after pinning");
            setMintingStep(0);
          }
        })
        .catch((err) => {
          console.error("Error in minting process", err);
          setMintingStep(0);
        });
    }
  }, [mintingStep]);  

  useEffect(() => {
    if (
      mintNewConfig &&
      mintNewConfig.tokenRendererInit &&
      mintNewConfig.tokenRendererInit.tokenURI &&
      mintingStep === 2
    ) {
      mintNewToken();
    }
  }, [mintNewConfig, mintingStep]);  

  // Observe tokenIdMinted and trigger mintNewToken when tokenIdMinted is updated
  useEffect(() => {
    if (tokenIdMinted) {
      mintNewToken()
        .then(() => setMintingStep(3))
        .catch((err) => {
          console.error("Error while minting new token", err);
          setMintingStep(0);
          setMinting(false);
        });
    }
  // }, [tokenIdMinted]);
}, [tokenIdMinted, mintNewConfig]);

  // Observe curationStatus and trigger curateMintedToken when curationStatus is "success"
  useEffect(() => {
    if (curationStatus === "success") {
      curateMintedToken()
        .then(() => {
          setMintingStep(0);
          setPublicationSucess(true);
          setMinting(false);
        })
        .catch((err) => {
          console.error("Error while curation minted token", err);
          setMintingStep(0);
          setMinting(false);
        });
    }
  }, [curationStatus]);  

  // const fullPublicationCycle = async () => {
  //   setMinting(true);
  
  //   try {
  //     await justPin();
  //     await mintNewToken();
  //     await curateMintedToken();
  //   } catch (err) {
  //     console.error("Error during the publication cycle:", err.message);
  //   } finally {
  //     setMinting(false);
  //   }
  // };

  // const fullPublicationCycle = async () => {
  //   setMinting(true)
  //   try {
  //     await justPin()
  //   } catch (err) {
  //     console.error("Error during pinning process")
  //   } try {
  //     await mintNewToken()
  //   } catch (err) {
  //     console.error("Error while minting new token")
  //   } try {
  //     await curateMintedToken()
  //   } catch (err) {
  //     console.error("Error while curation minted token")
  //   } finally {
  //     setMinting(false)
  //   }
  // }

  return (
    // <form onSubmit={handleSubmit} className="font-sans pl-4 flex flex-row flex-wrap justify-center items-start ">
    <div className="pl-4 flex flex-row flex-wrap justify-center items-start ">
      <h1 className="flex font-[helvetica] flex-row w-full h-fit  text-[18px]">Publish</h1>
      <>
      
        {!thumbnail ? (
          <>
            {!uploadLoading ? (
            <div
              onClick={handleClick} 
              className="hover:bg-[#FAFAFA]  hover:cursor-pointer flex flex-row w-full justify-center items-center h-[209px] border-[1.2px] border-[#E1E1E1] rounded-[8px]"
            >
              {/* Implement your drag-and-drop functionality here */}              
              <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="13.5" cy="13.5" r="13.5" fill="#F2F2F2"/>
              <path d="M10.4667 11.1778L13.6444 8M13.6444 8L16.8222 11.1778M13.6444 8V17.4167M7 13.5V15.9722C7 18.5722 7.46222 19.7278 9.31111 19.7278C11.16 19.7278 14.3185 19.7278 17.1111 19.7278C18.0741 19.7278 20 19.3811 20 17.9944C20 16.6078 20 13.8852 20 13.5" stroke="#6B6B6B"/>
              </svg>
              &nbsp;
              <div className="font-[helvetica]">
              Upload cover image
              </div>
              <input
                ref={inputFileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />                          
            </div>
              ) : (
              <div
                className="flex flex-row w-full justify-center items-center h-[209px] border-[1.2px] border-[#E1E1E1] rounded-[8px]"
              >                
                <div className='flex flex-row justify-center w-full'>
                <svg fill="#000000" width="38" height="20" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
                            <stop stop-color="#000000" stop-opacity="0" offset="0%"/>
                            <stop stop-color="#000000" stop-opacity=".631" offset="63.146%"/>
                            <stop stop-color="#000000" offset="100%"/>
                        </linearGradient>
                    </defs>
                    <g fill="none" fill-rule="evenodd">
                        <g transform="translate(1 1)">
                            <path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" stroke-width="2">
                                <animateTransform
                                    attributeName="transform"
                                    type="rotate"
                                    from="0 18 18"
                                    to="360 18 18"
                                    dur="0.9s"
                                    repeatCount="indefinite" />
                            </path>
                            <circle fill="#000000" cx="36" cy="18" r="1">
                                <animateTransform
                                    attributeName="transform"
                                    type="rotate"
                                    from="0 18 18"
                                    to="360 18 18"
                                    dur="0.9s"
                                    repeatCount="indefinite" />
                            </circle>
                        </g>
                    </g>
                </svg> 
                </div>               
              </div>
              )}              
              </>  
        ) : (
            <div
                className="relative overflow-hidden flex flex-row w-full justify-center items-center h-[209px] border-[1.2px] border-[#E1E1E1] rounded-[8px]"
            >
                <Image
                    src={URL.createObjectURL(thumbnail)}
                    fill
                    className="object-cover"
                    alt="Uploaded Thumbnail"
                    onLoad={() => URL.revokeObjectURL(URL.createObjectURL(thumbnail))}                
                />
                <div
                    className="absolute top-2 right-2 cursor-pointer" 
                    onClick={()=>resetThumbnailImage?.()}
                    // onClick={/* Add your onClick handler here */}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                  <path d="M24.4234 24.033C19.1362 29.5376 10.4065 29.7319 4.92508 24.467C-0.556349 19.2021 -0.713804 10.4716 4.5734 4.967C9.8606 -0.537623 18.5903 -0.731929 24.0717 4.533C29.5532 9.79794 29.7106 18.5284 24.4234 24.033Z" fill="#FCFCFC"/>
                  <path d="M9.94115 11.9619L11.1422 10.7115L14.3738 13.8154L17.5123 10.5478L18.7797 11.7652L15.6412 15.0327L18.8727 18.1366L17.6717 19.3871L14.4401 16.2832L11.3088 19.5433L10.0414 18.3259L13.1727 15.0658L9.94115 11.9619Z" fill="#666666"/>
                  </svg>
                </div>                
            </div>            
        )}
      </>



      <div className="font-[helvetica] w-full">
        <h2 className='font-[helvetica]'>Title</h2>
        <textarea
          rows="1"
          type="text"
          value={tokenMetadata.name}
          placeholder='Title'
          onChange={handleName}
          className="outline-none hover:bg-[#FAFAFA] focus:bg-[#FAFAFA] p-2 w-full border-[1.2px] border-[#E1E1E1] rounded-[8px]"
        />
      </div>

      <div className="font-[helvetica] w-full">
        <h2 className='font-[helvetica]'>Description</h2>
        <textarea
          rows="3"
          type="text"
          value={tokenMetadata.description}
          placeholder={
            !isDescriptionEdited
              ? truncatePlaceholder(markdownToPlainText(editorContext.getEditorValue.current()), 115)
              : ""
          }
          onChange={handleDescription}
          className="outline-none hover:bg-[#FAFAFA] focus:bg-[#FAFAFA] p-2 w-full border-[1.2px] border-[#E1E1E1] rounded-[8px]"
        />
      </div>

      <div className=" font-[helvetica] w-full">
        <h2 className='font-[helvetica]'>{"Price"}</h2>
        <input
          type="text"
          value={mintPrice}
          onChange={(e) => setMintPrice(e.target.value)}
          placeholder='0.00 ETH'
          className="outline-none hover:bg-[#FAFAFA] focus:bg-[#FAFAFA] p-2 w-full border-[1.2px] border-[#E1E1E1] rounded-[8px]"
        />
      </div>

      <div className="font-[helvetica] flex flex-row justify-start space-x-1 w-full h-fit">
        <button 
            onClick={()=>fullPublicationCycle()}
            className="w-[73px] py-2 rounded-[5.3px] border-[1.2px] border-black bg-black text-white hover:text-black hover:bg-white"
          >
            mint
        </button>
        {/* <button 
          onClick={()=>justPin()}
          className="w-[73px] py-2 rounded-[5.3px] border-[1.2px] border-black bg-black text-white hover:text-black hover:bg-white"
        >
            pin
        </button>
        <button 
          // onClick={()=>write()}
          onClick={()=>mintNewToken()}
          className="w-[73px] py-2 rounded-[5.3px] border-[1.2px] border-black bg-black text-white hover:text-black hover:bg-white"
        >
            mint
        </button>    
        <button 
          // onClick={()=>write()}
          onClick={()=>curationWrite()}
          className="w-[73px] py-2 rounded-[5.3px] border-[1.2px] border-black bg-black text-white hover:text-black hover:bg-white"
        >
            curate
        </button>                */}
      </div>
      

      {/* <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        Submit
      </button> */}
    {/* </form> */}  
    </div>
  );
};

export default CreateForm;