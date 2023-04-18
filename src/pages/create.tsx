// @ts-nocheck

import Head from 'next/head';
import React from 'react';
import { EditorContextProvider } from '../components/markdown/context/EditorContext';
import EditorPage from '../components/markdown/pages/EditorPage/EditorPage';

export default function Create() {
  return (
    <div>
      <Head>
        <title>mkdn | Editor</title>
      </Head>
      <EditorContextProvider>
        <EditorPage />
      </EditorContextProvider>
    </div>
  );
}