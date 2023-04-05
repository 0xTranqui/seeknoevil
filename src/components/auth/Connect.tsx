// @ts-nocheck
import { ConnectKitButton } from 'connectkit';
import { useAuth } from '../../hooks/useAuth'
import { shortenAddress } from '../../utils/shortenAddress'
import { useState} from 'react'
import Link from 'next/link';

export const Connect = () => {

    const { logout } = useAuth()
    const [showDisconnect, setShowDisonnect] = useState(false)

    const handleShowDisconnect = () => {
        setShowDisonnect(!showDisconnect)
    }

    const handleLogout = () => {
        setShowDisonnect(!showDisconnect)
        logout()
    }

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
                            <Link href="/create" className="hover:font-bold">
                                create
                            </Link>
                            <Link href="/manage" className="hover:font-bold">
                                manage
                            </Link>           
                            <div>
                                &nbsp;—&nbsp;
                            </div>                                              
                            <button className="text-black w-fit flex flex-row hover:font-bold" onClick={handleShowDisconnect}>
                                {ensName ? ensName : shortenAddress(address)}
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

export default Connect