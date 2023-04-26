import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    makeStyles,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import React from 'react';
import {useState} from 'react';
import { useEditorContext } from '../../context/EditorContext';
import Editor from 'rich-markdown-editor'
import CreateForm from '../../../create/CreateForm'

type Props = {
    open: boolean;
    setOpen(val: boolean): void;
};

const MintDialog: React.FC<Props> = ({ open, setOpen }) => {

    // Editor context
    const editorContext = useEditorContext();
    const closeDialog = () => setOpen(false);


    return (
        <Dialog
          open={open}
          onClose={closeDialog}
          maxWidth={false}
          className="flex flex-row justify-center custom-dialog"
        >
          <DialogContent className="grid grid-cols-[800px_430px] w-[1260px] h-[762px] custom-dialog-content">
            <div className="bg-[#525252] py-[10px] flex flex-row justify-center items-center">
              <div className=" bg-white flex flex-row w-[630px] overflow-y-auto">
                <div className="editor-wrapper h-[762px] overflow-y-auto">
                  <Editor
                    id="dialogue"
                    className="w-full px-10 mt-20"
                    disableExtensions={['container_notice']}
                    defaultValue={editorContext.getEditorValue.current()}
                    readOnly
                  />
                </div>
              </div>
            </div>
            <CreateForm />
          </DialogContent>
        </Dialog>
      );
    };

    export default MintDialog;
