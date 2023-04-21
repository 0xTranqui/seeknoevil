import Link from 'next/link';
import React, { useState } from 'react';
import Editor from 'rich-markdown-editor';

type Props = {
  markdown: string;
};

const MarkdownRenderer: React.FC<Props> = ({ markdown }) => {

  console.log("markdown getting passed in: ", markdown)

  return (
    <div>
      <Editor
        disableExtensions={['container_notice']}
        defaultValue={markdown}
        readOnly
      />
    </div>
  );
};

export default MarkdownRenderer;
