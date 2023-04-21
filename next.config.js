/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
      domains: ['res.cloudinary.com', 'nft-cdn.alchemy.com', 'ipfs.io', 'nft-cdn.alchemy.com/eth-goerli/']
    }
  }
  
  module.exports = nextConfig