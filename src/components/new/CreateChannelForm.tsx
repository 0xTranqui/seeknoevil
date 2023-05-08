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
    // Handle form submission, e.g., call your contract creation function here
    console.log("config at the last second:", config)
    write?.()
    console.log(formData);
  };

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
        Curation Pass (optional):
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
        className="w-full py-2 px-4 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
        Create
        </button>
    </div>
    </form>        
  );
};

export default CreateChannelForm;
