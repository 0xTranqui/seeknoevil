// ConnectKit
import { getDefaultClient } from 'connectkit';
// wagmi
import { createClient, configureChains } from 'wagmi';
import { mainnet, goerli, sepolia } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY_SEPOLIA;

const { provider, chains } = configureChains(
	[sepolia],
	[
	// commented out because ethers 5.7.2 doesnt support sepolia
    // needs to get updated to ethers ^6 or switch over to viem
	// cant update this yet because connect kit doesnt work with ethers > 6
    // alchemyProvider({ apiKey: alchemyKey as string }),
		publicProvider(),
	],
)

export const client = createClient(
	getDefaultClient({
		appName: 'seeknoevil',
		autoConnect: true,
		provider,
		chains
	}),
)



