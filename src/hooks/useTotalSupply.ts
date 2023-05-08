import { useState, useEffect } from 'react';

type Props = {
  collectionAddress: string;
  tokenId: string;
};

const useTotalSupply = ({ collectionAddress, tokenId }: Props) => {
  const [totalSupply, setTotalSupply] = useState('0');
  const [error, setError] = useState(null); // Add error state

  const fetchTotalSupply = () => {
    if (!collectionAddress || !tokenId) {
      return;
    }
    fetch(`https://goerli.ether.actor/${collectionAddress}/totalSupply/${tokenId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching total supply: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => {
        setTotalSupply(data);
        setError(null); // Clear the error state
      })
      .catch((error) => {
        console.error('Error:', error);
        setError(error); // Update the error state
      });
    return;
  };

  // run totalSupply fetch on page load
  useEffect(() => {
    fetchTotalSupply();
  }, [collectionAddress, tokenId]);

  return { totalSupply, fetchTotalSupply, error }; // Return the error state as well
};

export default useTotalSupply;
