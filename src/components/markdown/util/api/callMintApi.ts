import { ApiMintResponse } from '../../../../pages/api/mint';
import { Buffer } from 'buffer';

const callMintApi = async (file: File): Promise<ApiMintResponse> => {
  
  console.log("what is the file like?", file)
  
    // Construct form data with a `file` property
  const formData = new FormData();
  formData.append('file', file);

  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  console.log("file.type", file.type)

  const uploadResult = await fetch('/api/mint', {
    method: 'POST',
    body: formData,
  });

  console.log(uploadResult.status)

  console.log("mint result :", uploadResult)

  return uploadResult.json();
};

export default callMintApi;