import { makeStyles } from '@material-ui/core';
import React, { MutableRefObject } from 'react';

import Editor, { Props as EditorProps } from 'rich-markdown-editor';

type Props = {
  initialContent?: string;
  getMarkdownRef: MutableRefObject<() => string>;
} & Partial<
  Pick<
    EditorProps,
    | 'uploadImage'
    | 'onImageUploadStart'
    | 'onImageUploadStop'
    | 'onSave'
    | 'onShowToast'
  >
>;

const useStyles = makeStyles((theme) => ({}));

const MarkdownEditor: React.FC<Props> = ({
  getMarkdownRef,
  initialContent,
  ...editorProps
}) => {
  const classes = useStyles();

  return (
    <div className="shadow-[0_4px_23px_0px_rgba(0,0,0,0.15)] w-[813px] min-h-[100vh] border-[1px] pb-10 border-[#DCDCDC] bg-[#FFFFFF] flex flex-row items-start">
      <Editor
        className="mx-[80px] mt-[88px] w-full items-start"
        id="mkdn-1"
        onChange={(fn) => (getMarkdownRef.current = fn)}
        disableExtensions={['container_notice']}
        placeholder=""
        // defaultValue={initialContent}
        {...editorProps}
      />
    </div>
  );
};

export default MarkdownEditor;
