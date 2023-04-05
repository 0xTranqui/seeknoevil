//@ts-nocheck
import { useMemo } from "react"
import { useEnsName } from "wagmi"
import { shortenAddress } from "./shortenAddress"

export function ensResolution({address}: any) {

    const addressToResolve = address ? address : ""

    const { data: ensName } = useEnsName({
        address: addressToResolve as string | undefined,
    })

    const actor = useMemo(() => 
        ensName ? ensName : shortenAddress(addressToResolve)
        , [ensName, addressToResolve])

    return (
        actor 
    )
}
