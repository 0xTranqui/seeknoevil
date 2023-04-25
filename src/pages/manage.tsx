// @ts-nocheck

import Head from 'next/head';
import React from 'react';
import { useChannelAdmins } from '../providers/ChannelAdminProvider';
import { useAuth } from '../hooks/useAuth';


export default function Manage() {

  const { address } = useAuth()
  const userAddress = address ? address : null
  const { admin1, admin2 } = useChannelAdmins()

  return (
    <div>
      <Head>
        <title>manage</title>
      </Head>
      <>
      {userAddress !== admin1 && userAddress !== admin2 ? (
        <div className="flex flex-row w-full h-[100vh] justify-center items-center">
          {`you do not have access to "manage"`}
        </div>
      ) : (
        <div className="flex flex-row w-full h-[100vh] justify-center items-center">
            Manage functionality coming soon
        </div>
      )}
      </>
    </div>
  );
}