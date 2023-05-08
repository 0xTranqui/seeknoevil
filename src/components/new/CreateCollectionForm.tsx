import React, { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  name: string;
  symbol: string;
  owner: string;
}

const CreateCollectionForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    symbol: '',
    owner: ''
  });

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
            type="submit"
            className="w-full py-2 px-4 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
            Create
            </button>
        </div>
    </form>  
  );
};

export default CreateCollectionForm;
