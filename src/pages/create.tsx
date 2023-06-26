// @ts-nocheck

import Head from 'next/head';
import React from 'react';
import { EditorContextProvider } from '../components/markdown/context/EditorContext';
import EditorPage from '../components/markdown/pages/EditorPage/EditorPage';
import { useChannelAdmins } from '../providers/ChannelAdminProvider';
import { useAuth } from '../hooks/useAuth';

export default function Create() {

  const { address } = useAuth()
  const userAddress = address ? address : null
  const { admin1, admin2, admin3 } = useChannelAdmins()

  return (
    <div>
      <Head>
        <title>create</title>
      </Head>
      <>
      {userAddress !== admin1 && userAddress !== admin2 && userAddress !== admin3 ? (
        <div className="flex flex-row w-full h-[100vh] justify-center items-center">
          {`you do not have access to "create"`}
        </div>
      ) : (
      <EditorContextProvider>
        <EditorPage />
      </EditorContextProvider>
      )}
      </>
    </div>
  );
}