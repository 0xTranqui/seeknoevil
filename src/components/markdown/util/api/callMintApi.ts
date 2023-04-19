import { ApiMintResponse } from '../../../../pages/api/mint';

const callUploadApi = async (file: File): Promise<ApiMintResponse> => {
  
  console.log("what is the file like?", file)
  
    // Construct form data with a `file` property
  const formData = new FormData();
  formData.append('file', file);

  console.log("file.type", file.type)

//   const uploadResult = await fetch('/api/mint', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: file,
//   });

  const uploadResult = await fetch('/api/mint', {
    method: 'POST',
    body: formData,
  });

  console.log("mint result :", uploadResult)

  return uploadResult.json();
};

export default callUploadApi;