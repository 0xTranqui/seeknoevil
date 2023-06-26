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
import { ChannelAdminProvider } from "../providers/ChannelAdminProvider"
import { ENSResolverProvider } from '../providers/ENSResolverProvider';
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react';

// determines what curation contract will be used for blog context
const channel = process.env.NEXT_PUBLIC_AP_721_CURATION_CONTRACT;

const channelAdmin_1 = "0x153D2A196dc8f1F6b9Aa87241864B3e4d4FEc170"
const channelAdmin_2 = "0x4C53C6D546C9E38db56040Ab505460A9187A5281"
const channelAdmin_3 = "0xbC68dee71fd19C6eb4028F98F3C3aB62aAD6FeF3"

const favicon = "../public/favicon.png"

const livePeerAPIKey = process.env.NEXT_PUBLIC_STUDIO_API_KEY
if (!livePeerAPIKey) {
  throw new Error("Livepeer API key not found");
}

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: livePeerAPIKey
    // baseUrl: {not sure what goes here}
  }),
});

console.log("livepeer client", livepeerClient)

function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <CurationDataProvider curationContract={channel} >
          <ChannelAdminProvider channelAdmin1={channelAdmin_1} channelAdmin2={channelAdmin_2} channelAdmin3={channelAdmin_3}/>
            <ENSResolverProvider>
              <LivepeerConfig client={livepeerClient}>
                <NextHead>
                  <title>seeknoevil</title>
                  <link rel="icon" type="image/png" sizes="24x24" href={favicon} />
                </NextHead>
                <Header />
                <Footer />
                {mounted && <Component {...pageProps} />}
              </LivepeerConfig>
            </ENSResolverProvider>
          </ChannelAdminProvider>
        </CurationDataProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default App;
