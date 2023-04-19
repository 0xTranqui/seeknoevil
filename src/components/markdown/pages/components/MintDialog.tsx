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
        <Dialog open={open} onClose={closeDialog} maxWidth={false} className="flex flex-row justify-center" >
            {/* <DialogContent className={classes.dialogContent}> */}
            <DialogContent className="grid grid-cols-[800px_400px] w-[1260px] h-[762px]">
                <div className="bg-[#525252] flex flex-row h-full justify-center items-center">
                    <div className=" bg-white flex flex-row w-[612px] h-[660px]">
                        <Editor
                            id="dialogue"
                            className="w-full"
                            disableExtensions={['container_notice']}
                            defaultValue={editorContext.getEditorValue.current()}
                            readOnly                
                        />
                    </div>
                </div>
                <CreateForm />
            </DialogContent>
            {/* <DialogActions>
                <Button onClick={closeDialog} color="primary">
                Close
                </Button>
            </DialogActions> */}
            </Dialog>
        );
    };

    export default MintDialog;
