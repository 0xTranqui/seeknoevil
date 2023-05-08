import useMintNew from '../hooks/useMintNew';
import useMintWithData from '../hooks/useMintWithData';
import { useState } from 'react';
import CreateChannelForm from '../components/new/CreateChannelForm';
import CreateCollectionForm from '../components/new/CreateCollectionForm';


function New() {

    // default view state
    // 0 = channel view
    // 1 = collection view
    const [currentView, setCurrentView] = useState(0)

    const handleCurrentView = () => {
        if (currentView == 0) {
            setCurrentView(1)
        } else {
            setCurrentView(0)
        }
    }

  return (
    <div className="flex flex-col h-[100vh] w-full">
      <div className="pt-20 text-[20px] flex justify-center space-x-10">
        <button
          onClick={() => handleCurrentView()}
          className={`${currentView == 0 ? 'opacity-100' : 'opacity-50'} w-fit flex flex-row items-end`}
        >
          Channel
        </button>
        <button
          onClick={() => handleCurrentView()}
          className={`${currentView == 1 ? 'opacity-100' : 'opacity-50'} w-fit flex flex-row items-end`}
        >
          Collection
        </button>
      </div>
      <div className="flex-grow flex items-start pt-[60px] justify-center">
        {currentView == 0 ? <CreateChannelForm /> : <CreateCollectionForm />}
      </div>
    </div>
  );
}

export default New;
