// ENSResolverProvider.tsx

// @ts-nocheck

import React, { createContext, useContext, useState } from 'react';
import { ApolloClient, gql, InMemoryCache } from '@apollo/client';

const ENS_SUBGRAPH_URI = 'https://api.thegraph.com/subgraphs/name/ensdomains/ens';

const apolloClient = new ApolloClient({
  uri: ENS_SUBGRAPH_URI,
  cache: new InMemoryCache(),
});

const GET_ENS_NAME_BY_ADDRESS = gql`
  query GetENSNameByAddress($account: String!) {
    accounts(where: { id: $account }) {
      domains {
        name
      }
    }
  }
`;

async function getENSNameByAddress(address) {
    console.log("ens query running")
    console.log("addrss passed into query: ", address)
  try {
    const { data } = await apolloClient.query({
      query: GET_ENS_NAME_BY_ADDRESS,
      variables: { account: address.toLowerCase() },
    });

    if (data.accounts.length > 0 && data.accounts[0].domains.length > 0) {
      return data.accounts[0].domains[0].name;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching ENS name:', error);
    return null;
  }
}

const ENSResolverContext = createContext({ getENSNameByAddress });

interface ENSResolverProviderProps {
  children: React.ReactNode;
}

export function ENSResolverProvider({ children }: ENSResolverProviderProps) {
  return <ENSResolverContext.Provider value={{ getENSNameByAddress }}>{children}</ENSResolverContext.Provider>;
}

export function useENSResolver() {
  const context = useContext(ENSResolverContext);

  if (context === undefined) {
    throw new Error('useENSResolver must be used within an ENSResolverProvider');
  }

  return context;
}
