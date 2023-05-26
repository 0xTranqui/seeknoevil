// @ts-nocheck

import { ConnectKitButton } from 'connectkit';
import { useAuth } from '../../hooks/useAuth';
import { shortenAddress } from '../../utils/shortenAddress';
import { useState } from 'react';
import Link from 'next/link';
import { useChannelAdmins } from '../../providers/ChannelAdminProvider';
import useENSResolver from "../../hooks/useENSResolver";

export const Connect = () => {
  const { address, logout } = useAuth();
  const userAddress = address ? address : null;
  const { admin1, admin2 } = useChannelAdmins();
  const [showDisconnect, setShowDisonnect] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const user = address ? address : null;
  const resolvedUser = useENSResolver({ address: user });  

  const handleShowDisconnect = () => {
    setShowDisonnect(!showDisconnect);
  };

  const handleLogout = () => {
    setShowDisonnect(!showDisconnect);
    logout();
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const isAdmin = userAddress === admin1 || userAddress === admin2;

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {
        return (
          <>
            {!isConnected ? (
              <button className="hover:font-bold" onClick={show}>
                {"connect"}
              </button>
            ) : (
              <div className="flex flex-row flex-wrap border-black">
                {showDisconnect ? (
                  <div className="w-full flex flex-row justify-end">
                    <button className="hover:font-bold w-fit flex flex-row pb-2" onClick={handleLogout}>
                      {"disconnect"}
                    </button>
                  </div>
                ) : (
                  <></>
                )}
                <div className="flex flex-row w-full justify-end space-x-2">
                  {isAdmin && (
                    <>
                      {showOptions && (
                        <>
                          <Link href="/create" className="hover:font-bold">
                            create
                          </Link>
                          <Link href="/manage" className="hover:font-bold">
                            manage
                          </Link>
                        </>
                      )}
                      &nbsp;
                      <button className="hover:font-bold" onClick={toggleOptions}>
                        {showOptions ? '–' : '+'}
                      </button>
                      &nbsp;
                    </>
                  )}
                  <button className="text-black w-fit flex flex-row hover:font-bold" onClick={handleShowDisconnect}>
                    {resolvedUser ? resolvedUser : shortenAddress(user)}
                  </button>
                </div>
              </div>
            )}
          </>
        );
      }}
    </ConnectKitButton.Custom>
  );
};

export default Connect;
