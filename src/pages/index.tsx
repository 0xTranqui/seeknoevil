// @ts-nocheck

import { ConnectKitButton } from 'connectkit';
import { useAccount } from 'wagmi';
import Feed  from '../components/feed/Feed'

function Page() {
  
  const channel = "0xe945f1a1671d6819bedbb9178aed41b11e8b83a8";

  return (
    <>
    <Feed curationContract={channel} />
    </>
  );
}

export default Page;
