// @ts-nocheck

import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { useEditorContext } from '../markdown/context/EditorContext'
import { useMintAndCurate } from '../../hooks/useMintAndCurate'
import {marked} from 'marked';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

const junghwan_eth = "0x4C53C6D546C9E38db56040Ab505460A9187A5281"
const tranqui_eth = "0x806164c929Ad3A6f4bd70c2370b3Ef36c64dEaa8"
const devtest_eth = "0xF2365A26f766109b5322B0f90d71c21bF32bda04"

const CreateForm = () => {

  const showPublicationStatusToast = () => {
    toast(
      <div className="flex w-full items-center space-x-2 font-[helvetica]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="9.89691" fill="#5CF359" stroke="#52D325" stroke-width="0.206186"/>
        <path d="M6.53483 8.68113L5.25781 10.103L8.8454 13.4327L14.8454 7.2277L13.6343 5.97925L8.8454 10.9544L6.53483 8.68113Z" fill="white"/>
        </svg>
        <div className="flex flex-row">
          <div className='font-[helvetica]'>
            {`"${tokenMetadata.name}"`}&nbsp;successfully published!
          </div>
          &nbsp;
          <Link
            href="/"
            className='font-[helvetica] underline hover:font:bold'
            >
              Back to feed
          </Link>
        </div>
      </div>,
      {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 5000,
        toastClassName: 'custom-toast-container',
        progressClassName: 'no-progress-bar'
      }
    );
  };  

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
          tokenURI: ""
      },
      fundsRecipient: "0x153D2A196dc8f1F6b9Aa87241864B3e4d4FEc170",
      royaltyBPS: "0",
      primarySaleFeeRecipient: "0x153D2A196dc8f1F6b9Aa87241864B3e4d4FEc170",
      primarySaleFeeBPS: "0",
      soulbound: "false"
  }) 

  const {
    // mintNew returns
    write,
    writeAsync,
    data,
    isError,
    isLoading,
    isSuccess,
    status,
    tokenIdMinted,
    mintNewData,
    mintNewLoading,
    // mintWithData returns,
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
  } = useMintAndCurate({ mintNewConfig });    

  // publishing markdown to ipfs 
  const editorContext = useEditorContext()

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
      console.log("is the json string correct?", jsonString)
      const jsonBlob = new Blob([jsonString], { type: "application/json" });
      const jsonFile = new File([jsonBlob], "tokenMetadata.json", { type: "application/json", lastModified: Date.now() });
      const cid = await editorContext.uploadTokenMetadata(jsonFile)
      console.log("metadata cid: ", cid)
      return cid      
    } catch (err) {
      console.error("Error uploading metadata", err)
    }
  }

  const pin = async () => {
    try {
      const animationUrl = await handleMarkdownUpload();
      const tokenURI = "ipfs://" + (await handleMetadataUpload(animationUrl));
      console.log("tokenURI logged in justPin", tokenURI);
      handleTokenURI(tokenURI)
      setMintingStep(1)
    } catch (err) {
      console.error("Error in minting process");
    }
  }
  const handleTokenURI = async (tokenURI) => {
    console.log("handleTokenURI running");
    setMintNewConfig((prevConfig) => {
      return {
        ...prevConfig,
        tokenRendererInit: {
          ...prevConfig.tokenRendererInit,
          tokenURI: tokenURI,
        },
      };
    });
  };

  const [tokenHasBeenMinted, setTokenHasBeenMinted] = useState(false)

  // trigger mint once cover image is pinned and state has updated
  useEffect(() => {
    if (!!mintNewConfig.tokenRendererInit.tokenURI && !tokenHasBeenMinted && !!write) {
      setTokenHasBeenMinted(true)
      write();        
    }
  }, [mintNewConfig.tokenRendererInit.tokenURI, write]);  

  // trigger success toast once curation success == true + transaction has settled
  useEffect(() => {
    if (curationIsSuccess && !mintWaitLoading) {
      showPublicationStatusToast();
    }
  }, [curationIsSuccess, mintWaitLoading]);

  const svgLoader = () => {
    return (
        <svg fill="#fff" width="38" height="20" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
          <defs>
              <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
                  <stop stop-color="#fff" stop-opacity="0" offset="0%"/>
                  <stop stop-color="#fff" stop-opacity=".631" offset="63.146%"/>
                  <stop stop-color="#fff" offset="100%"/>
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
                  <circle fill="#fff" cx="36" cy="18" r="1">
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
      )
    }
  
  const publicationStatus = isLoading || mintNewLoading || curationIsLoading || mintWaitLoading
    ? svgLoader()
    : "publish"

  return (
    <div className=" h-[700px] pl-8 flex flex-row flex-wrap w-full justify-center items-center">
      <ToastContainer hideProgressBar={true} style={{width: "620px"}} />
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
                <svg fill="#000000" width="76" height="40" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
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

      <div className="font-[helvetica] flex flex-row justify-end space-x-1 w-full h-fit">
        <button 
          onClick={
            ()=>{
              pin()
            }}
          className="text-[13px] w-[73px] py-2 rounded-[5.3px] border-[1.2px] border-black bg-black text-white hover:text-black hover:bg-white flex flex-row justify-center items-center"
        >
          {publicationStatus}
        </button>           
      </div>
    </div>
  );
};

export default CreateForm;