import React, { useState, ChangeEvent, FormEvent } from 'react';
import {useCreate1155Press} from "../../hooks/useCreate1155Press"
import { useAuth } from '../../hooks/useAuth';
import { useModal } from 'connectkit';
import { utils } from 'ethers';

interface FormData {
  name: string;
  symbol: string;
  owner: string;
}

const zeroAddress = "0x0000000000000000000000000000000000000000"

const CreateCollectionForm: React.FC = () => {

  const { address } = useAuth()
  const userAddress = address ? address : null

  const [formData, setFormData] = useState<FormData>({
    name: '',
    symbol: '',
    owner: ''
  });

  const ownerCleaned = utils.isAddress(formData.owner) ? formData.owner : zeroAddress

  const logicInitInput = utils.defaultAbiCoder.encode(
    ["address", "uint256"],
    [
      ownerCleaned, // owner of collection
      0, // mintNewPrice. hardcoded to zero
    ]
  )  

  const {
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
  } = useCreate1155Press({
    channelName: formData.name,
    channelSymbol: formData.symbol,
    initialOwner: ownerCleaned,
    logicInit: logicInitInput
  })

  console.log("createCollectionData: ", createCollectionData)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    write?.()
  };

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
  
  const createStatus = isLoading || createCollectionLoading
    ? svgLoader()
    : "create"  

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto grid grid-cols-2 gap-4">
        <div className="col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name:
            </label>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded py-2 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
            />
        </div>

        <div className="col-span-2">
            <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">
                Symbol:
            </label>
            <input
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded py-2 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
            />
        </div>

        <div className="col-span-2">
            <label htmlFor="owner" className="block text-sm font-medium text-gray-700">
                Owner:
            </label>
            <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded py-2 px-3 text-sm focus:ring-gray-500 focus:border-gray-500"
                required
            />
        </div>

        <div className="col-span-2">
            <button
            disabled={!userAddress ? true : false}
            type="submit"
            className="w-full flex flex-row justify-center py-2 px-4 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
            {createStatus}
            </button>
        </div>
      <>
      {isSuccess && !createCollectionLoading ? (
        <div className="col-span-2 flex flex-row flex-wrap ">
          <div className="flex flex-row w-full">
            {"collection successfully deployed at: "}
          </div>
          <a 
          href={`https://sepolia.etherscan.io/address/${createCollectionData?.logs?.[0]?.address}`}
          className="hover:underline flex flex-row w-full">
            {`${createCollectionData?.logs?.[0]?.address} ->`}
          </a>          
        </div>
      ) : (
        <></>
      )}
      </>
    </form>  
  );
};

export default CreateCollectionForm;
