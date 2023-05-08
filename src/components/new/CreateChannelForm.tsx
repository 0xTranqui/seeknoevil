import React, { useState, ChangeEvent, FormEvent } from 'react';
import {useCreate721Press} from "../../hooks/useCreate721Press"
import { useAuth } from '../../hooks/useAuth';
import { utils } from 'ethers';

interface FormData {
  name: string;
  admin1: string;
  admin2: string;
  admin3: string;
  curationPass: string;
}

const hybridAccessModule = process.env.NEXT_PUBLIC_AP_HYBRID_ACCESS_SEPOLIA ? process.env.NEXT_PUBLIC_AP_HYBRID_ACCESS_SEPOLIA : ""
const zeroAddress = "0x0000000000000000000000000000000000000000"

const CreateChannelForm: React.FC = () => {

  const { address } = useAuth()
  const initialOwnerInput = address ? address : ""

  const [formData, setFormData] = useState<FormData>({
    name: '',
    admin1: '',
    admin2: '',
    admin3: '',
    curationPass: ''
  });

  const admin1Cleaned = utils.isAddress(formData.admin1) ? formData.admin1 : zeroAddress
  const admin2Cleaned = utils.isAddress(formData.admin2) ? formData.admin2 : zeroAddress
  const admin3Cleaned = utils.isAddress(formData.admin3) ? formData.admin3 : zeroAddress
  const curationPassCleaned = utils.isAddress(formData.curationPass) ? formData.curationPass : zeroAddress

  const createAccessInitArray = (arrayOfAdmins: any) => {
    let array = []
    for (let i = 0; i < 3; i++ ) {
      if (arrayOfAdmins[i] === zeroAddress) {
        continue
      } else {
        array.push([arrayOfAdmins[i], "3"])
      }
    }
    return array
  }

  const accessModuleInit = utils.defaultAbiCoder.encode(
    // encoding types are address + array of access role structs
    ["address", "(address, uint8)[]"],
    [
      curationPassCleaned, // curation pass
      createAccessInitArray([admin1Cleaned, admin2Cleaned, admin3Cleaned]) // array of role detail structs
    ]
  )

  const logicInitInput = utils.defaultAbiCoder.encode(
    ["bool", "address", "bytes"],
    [
      false, // initial pause state == not paused
      hybridAccessModule, // access module == hybrid access mdule
      accessModuleInit// access module init
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
    createChannelData,
    createChannelLoading    
  } = useCreate721Press({
    channelName: formData.name,
    initialOwner: initialOwnerInput,
    logicInit: logicInitInput
  })

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
  
  const createStatus = isLoading || createChannelLoading
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
      <label htmlFor="admin1" className="block text-sm font-medium text-gray-700">
        Admin 1:
      </label>
      <input
        type="text"
        name="admin1"
        value={formData.admin1}
        onChange={handleChange}
        className="mt-1 block w-full border border-gray-300 rounded py-2 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
        required
      />
    </div>

    <div className="col-span-1">
      <label htmlFor="admin2" className="block text-sm font-medium text-gray-700">
        Admin 2 (optional):
      </label>
      <input
        type="text"
        name="admin2"
        value={formData.admin2}
        onChange={handleChange}
        className="mt-1 block w-full border border-gray-300 rounded py-2 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>

    <div className="col-span-1">
      <label htmlFor="admin3" className="block text-sm font-medium text-gray-700">
        Admin 3 (optional):
      </label>
      <input
        type="text"
        name="admin3"
        value={formData.admin3}
        onChange={handleChange}
        className="mt-1 block w-full border border-gray-300 rounded py-2 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>

    <div className="col-span-2">
      <label htmlFor="curationPass" className="block text-sm font-medium text-gray-700">
        ERC721 Curation Pass (optional):
      </label>
      <input
        type="text"
        name="curationPass"
        value={formData.curationPass}
        onChange={handleChange}
        className="mt-1 block w-full border border-gray-300 rounded py-2 px-3 text-sm focus:ring-gray-500 focus:border-gray-500"
        />
        </div>
        <div className="col-span-2">
        <button
        disabled={!initialOwnerInput ? true : false}
        type="submit"
        className="w-full flex flex-row justify-center py-2 px-4 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
        {createStatus}
        </button>
    </div>
    <>
      {isSuccess && !createChannelLoading ? (
        <div className="col-span-2 flex flex-row flex-wrap ">
          <div className="flex flex-row w-full">
            {"collection successfully deployed at: "}
          </div>
          <a 
          href={`https://sepolia.etherscan.io/address/${createChannelData?.logs?.[0]?.address}`}
          className="hover:underline flex flex-row w-full">
            {`${createChannelData?.logs?.[0]?.address} ->`}
          </a>          
        </div>
      ) : (
        <></>
      )}
      </>    
    </form>        
  );
};

export default CreateChannelForm;
