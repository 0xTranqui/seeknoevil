import '../styles/globals.css';
import { ConnectKitProvider } from 'connectkit';
import type { AppProps } from 'next/app';
import NextHead from 'next/head';
import * as React from 'react';
import { WagmiConfig } from 'wagmi';
import { client } from '../wagmi';
import { Footer } from '../components';
import { Header } from '../components';
import { CurationDataProvider } from "../providers/CurationDataProvider"


// determines what curation contract will be used for blog context
const channel = "0xe945f1a1671d6819bedbb9178aed41b11e8b83a8";

function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <CurationDataProvider curationContract={channel} >
          <NextHead>
            <title>seeknoevil</title>
          </NextHead>
          <Header />
          <Footer />
          {mounted && <Component {...pageProps} />}
        </CurationDataProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default App;
