import Head from 'next/head';
import React from 'react';
import MarkdownViewerPage from '../../components/markdown/pages/MarkdownViewerPage/MarkdownViewerPage';

export default function MarkdownViewerEntrypoint() {
  return (
    <div>
      <Head>
        <title>mkdn | Viewer</title>
      </Head>
      <MarkdownViewerPage />
    </div>
  );
}
