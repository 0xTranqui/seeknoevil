// @ts-nocheck

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Editor from 'rich-markdown-editor';

type Props = {
  ipfsPath: string;
};

const MarkdownViewer: React.FC<Props> = ({ ipfsPath }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMarkdown = async (pathToCID: string) => {
    const fetchResp = await fetch(pathToCID);

    if (fetchResp.status !== 200) {
      throw Error('Invalid status code');
    }

    return fetchResp.text();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const markdown = await fetchMarkdown(ipfsPath);
        setContent(markdown);
        setLoading(false);
        if (!markdown) {
          setError('No content was fetched.');
        }
      } catch (error) {
        setLoading(false);
        setError('Error fetching markdown: ' + error);
        console.error('Error fetching markdown:', error);
      }
    };
    fetchData();
  }, [ipfsPath]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className=" w-full h-fit pb-20 border-[#DCDCDC] bg-[#FFFFFF] leading flex flex-row items-start">        
      <Editor
        className=" w-full items-start text-[19px] sm:text-[17px]"
        disableExtensions={['container_notice']}
        defaultValue={content}
        readOnly
      />
    </div>
  );
};

export default MarkdownViewer;
