import React from 'react';
import SpacingContainer from '../../components/SpacingContainer/SpacingContainer';

type Props = {
  onPublishClicked(): void;
};

const PublishButton: React.FC<Props> = ({ onPublishClicked }) => {
  return (
    <SpacingContainer direction="row-reverse">
        <button 
            onClick={onPublishClicked}
            className="font-[helvetica] mb-[7px] w-fit hover:cursor-pointer  text-[12px] rounded-[10px] flex flex-row justify-center items-center "
        >
            Publish&nbsp;
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="12" viewBox="0 0 11 12" fill="none">
            <path d="M0 6H10M10 6L5.29412 1M10 6L5.88235 11" stroke="black"/>
            </svg>
        </button>
      {/* <IconButton color="secondary" onClick={onPublishClicked} size="small">
        <SettingsIcon />
      </IconButton> */}
    </SpacingContainer>
  );
};

export default PublishButton;
