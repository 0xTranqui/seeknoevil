import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

type Props = {
  collectionAddress: string;
  tokenId: string;
};

const useNumMinted = ({ collectionAddress, tokenId }: Props) => {
  const { address } = useAuth();
  const userAddress = address
    ? address
    : '0x0000000000000000000000000000000000000000';
  const [numMinted, setNumMinted] = useState('0');
  const [error, setError] = useState(null); // Add error state

  const fetchNumMinted = async () => {
    if (!collectionAddress || !tokenId) {
      return;
    }
    fetch(
      `https://sepolia.ether.actor/${collectionAddress}/numMinted/${tokenId}/${userAddress}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching num minted: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => {
        setNumMinted(data);
        setError(null); // Clear the error state
      })
      .catch((error) => {
        setError(error); // Update the error state
      });
    return;
  };

  // run fetchNumMinted fetch on any change to userAddress
  useEffect(() => {
    fetchNumMinted();
  }, [userAddress, collectionAddress, tokenId]);

  return { numMinted, fetchNumMinted, error }; // Return the error state as well
};

export default useNumMinted;