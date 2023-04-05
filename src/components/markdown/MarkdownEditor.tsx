import { useState } from 'react';
import Editor from "@akord/rich-markdown-editor";

const MarkdownEditor = () => {
  const [markdownText, setMarkdownText] = useState('');

  const handleTextChange = (e) => {
    setMarkdownText(e.target.value);
  };

  return (
    <div className="w-[819px] border-2 h-[100vh]">
        <Editor
        id='123'
        />
    </div>
  );
};

export default MarkdownEditor;