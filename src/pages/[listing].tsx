// @ts-nocheck

import { NextPage } from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCurationData } from "../providers/CurationDataProvider";
import MarkdownViewer from "../components/markdown/MarkdownViewer";
import { shortenAddress } from "../utils/shortenAddress";
import useMintExisting from "../hooks/useMintExisting";
import { useAuth } from "../hooks/useAuth";
import { useModal } from "connectkit";
import ListingInfo from "../components/mintSection/ListingInfo";
import useNumMinted from "../hooks/useNumMinted";
import useTotalSupply from "../hooks/useTotalSupply";
import VideoPlayerSimple from "../components/video/VideoPlayerSimple";
import useENSResolver from "../hooks/useENSResolver";
import useGetTokenCreator from "../hooks/useGetTokenCreator";
import SvgLoader from "../components/mintSection/SvgLoader";
import { hasMarkdownPattern } from "../utils/hasMarkdownPattern";
import { convertDate } from "../utils/convertDate";

const ListingPage: NextPage = () => {
  const router = useRouter();
  const { listing } = router.query;
  const listingId: any = listing ? listing : "";
  const { listed, updated, parsed } = useCurationData();
  const { address, provider } = useAuth();
  const { setOpen } = useModal();

  const fetchMediaType = async (ipfsPath) => {
    if (!ipfsPath) return null;
    try {
      const response = await fetch(ipfsPath);
      if (!response.ok) {
        throw new Error("Failed to fetch media");
      }
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('video/mp4')) {
        return "video";
      }
      // Check for markdown
      const buffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(buffer);
      const textDecoder = new TextDecoder();
      const textContent = textDecoder.decode(uint8Array);
      if (hasMarkdownPattern(textContent)) {
        return "markdown";
      }
    } catch (error) {
      console.error("Failed to fetch media type:", error);
      return null;
    }
  };

  const collectionToMintFrom = parsed && parsed[listingId]?.contract?.address;
  const tokenIdToMint = parsed && parsed[listingId]?.tokenId;
  const userAddress = address ? address : null;

  const { tokenCreator, tokenCreated } = useGetTokenCreator({
    providerForQuery: provider,
    collection: collectionToMintFrom,
    tokenId: tokenIdToMint,
  });

  const { numMinted, fetchNumMinted } = useNumMinted({
    collectionAddress: process.env.NEXT_PUBLIC_AP_1155_CONTRACT,
    tokenId: tokenIdToMint,
  });

  const { totalSupply, fetchTotalSupply } = useTotalSupply({
    collectionAddress: process.env.NEXT_PUBLIC_AP_1155_CONTRACT,
    tokenId: tokenIdToMint,
  });

  // function to refresh mint counts on successful mintExisting call
  const refreshMintData = () => {
    fetchNumMinted();
    fetchTotalSupply();
  };

  const { write, isLoading, isSuccess, mintExistingLoading } = useMintExisting({
    collection: collectionToMintFrom,
    tokenId: tokenIdToMint,
    userAddress: userAddress,
    onSuccessCB: refreshMintData,
  });

  const handleMintInteraction = () => {
    console.log("user adddress : ", userAddress)
    if (userAddress) {
      write?.();
    } else {
      setOpen?.(true);
    }
  };

  const collectButtonContent =
    numMinted > 0
      ? "Collected!"
      : isLoading || mintExistingLoading
      ? <SvgLoader />
      : isSuccess && !mintExistingLoading && !isLoading
      ? "Collected!"
      : "Collect – 0.00 ETH";

  const processIPFS = (ipfsPlain: string) => {
    // let converted = "https://ipfs.io/ipfs/" + ipfsPlain.slice(7)
    let converted = "https://cloudflare-ipfs.com/ipfs/" + ipfsPlain.slice(7);
    return converted;
  };

  const animationUrl = parsed && parsed[listingId]?.rawMetadata?.animation_url;
  const ipfsPath = animationUrl ? processIPFS(animationUrl) : "";
  const imageURL = parsed && parsed[listingId]?.media?.gateway;

  const title = parsed && parsed[listingId]?.title;
  const author = tokenCreator ? tokenCreator : null;
  const resolvedAuthor = useENSResolver({ address: author });
  const description = parsed && parsed[listingId]?.description;

  const publicationDate = tokenCreated ? convertDate(tokenCreated) : "mm/dd/yy"

  const [mediaType, setMediaType] = useState(null);

  useEffect(() => {
    (async () => {
      const type = await fetchMediaType(ipfsPath);
      setMediaType(type);
    })();
  }, [ipfsPath]);

  if (!mediaType) {
    return (
      <div className="text-[14px] flex flex-row flex-wrap  bg-[#FFFFFF] min-h-[100vh] pt-10 pb-[90px] sm:pb-[108px] h-full w-full justify-center sm:justify-start ">
        <div className="pt-[80px] sm:pt-[10px] sm:px-[16px]">
          loading
          <span className="ml-[6px] dot-animation">
            <div></div>
            <div></div>
            <div></div>
          </span>
        </div>
      </div>
    );
  } else if (mediaType === "markdown") {
    return (
      <div className="text-[14px] flex flex-row flex-wrap  bg-[#FFFFFF] min-h-[100vh] pt-10 pb-[90px] sm:pb-[108px] h-full w-full justify-center ">
        <div className=" w-[360px] sm:w-[500px] md:w-[625px] pt-[80px] sm:pt-[110px]">
          <div className="font-[helvetica] flex flex-row w-full justify-start text-[24px] font-normal">
            {title}
          </div>
          <div className="font-[helvetica] flex flex-row w-full justify-start text-[15px] mt-[35px] sm:mt-[58px] mb-[6px]">
            <div className="font-[helvetica]">by&nbsp;</div>
            <a
              href={`https://sepolia.etherscan.io/address/${author}`}
              className="font-[helvetica] hover:underline"
            >
              {!!author
                ? !!resolvedAuthor
                  ? resolvedAuthor
                  : shortenAddress(author)
                : "unknown"}
            </a>
            &nbsp;{"– " + publicationDate}
          </div>
          <div className="font-[helvetica] text-[14px] mt-[19px] mb-[60px] sm:mb-[19px] font-normal">
            {description}
          </div>            
          {ipfsPath && <MarkdownViewer ipfsPath={ipfsPath} />}
          <ListingInfo
            collectionAddress={process.env.NEXT_PUBLIC_AP_1155_CONTRACT}
            tokenId={tokenIdToMint}
          />
          <div className="w-full flex flex-row mt-[65px] items-center">
            {/* 
                this button is being disabled whenever someone has minted at least one token. 
                this is correct for free mints where mint cap per wallet = 1, but is incorrect for
                paid mints where users can mint unlimited quantity
            */}
            <button
              disabled={
                numMinted > 0 ||
                (isSuccess && !mintExistingLoading && !isLoading)
                  ? true
                  : false
              }
              onClick={() => handleMintInteraction?.()}
              className={`${
                isLoading || mintExistingLoading ? "bg-black text-white" : ""
              } disabled:cursor-default focus:bg-black focus:text-white text-center min-h-[46px] min-x-[186px] h-[46px] w-[186px] text-[14px] border-[1px] border-black font-[helvetica] rounded-[35px]   hover:cursor-pointer`}
            >
              {collectButtonContent}
            </button>
            <div className="ml-[23px] text-black font-IBMPlexMono">
              {totalSupply}&nbsp;minted
            </div>
          </div>
        </div>
      </div>
    );
  } else if (mediaType === "video") {
    return (
      <div className="text-[14px] flex flex-col sm:items-center bg-[#FFFFFF] min-h-[100vh] pt-[77px] sm:pt-10 pb-[90px] sm:pb-[108px] h-full w-full sm:justify-center">
        <div className="sm:pt-[25px] w-full">
          <VideoPlayerSimple videoPath={ipfsPath} thumnbnailURL={imageURL} />
          <div className="flex flex-col sm:flex-row  w-full sm:justify-between mt-4 sm:mt-0">
            <div className="pl-[17px] sm:pl-[48px] pt-[16px] ">
              <div className="font-[helvetica] text-[20px] font-normal">
                {title}
              </div>
              <div className="flex flex-row font-[helvetica] text-[14px]">
                <div className="font-[helvetica]">by&nbsp;</div>
                <a
                  href={`https://goerli.etherscan.io/address/${author}`}
                  className="font-[helvetica] hover:underline"
                >
                  {
                    !!author
                    ? !!resolvedAuthor
                      ? resolvedAuthor
                      : shortenAddress(author)
                    : "unknown"
                  }
                </a>
                &nbsp;{"– " + publicationDate}
              </div>
              <div className="font-[helvetica] text-[14px] mt-[19px] mb-[60px] sm:mb-[19px] font-normal">
                {description}
              </div>
              <ListingInfo
                collectionAddress={process.env.NEXT_PUBLIC_AP_1155_CONTRACT}
                tokenId={tokenIdToMint}
              />
            </div>
            <div className="px-4 sm:pr-[212px] flex flex-col sm:flex-row flex-wrap items-start">
              <div className="w-full flex flex-row items-center pt-[16px] mb-[19px]">
                <button
                  disabled={
                    numMinted > 0 ||
                    (isSuccess && !mintExistingLoading && !isLoading)
                      ? true
                      : false
                  }
                  onClick={() => handleMintInteraction?.()}
                  className={`${
                    isLoading || mintExistingLoading
                      ? "bg-black text-white"
                      : ""
                  } disabled:cursor-default focus:bg-black focus:text-white text-center min-h-[39px] min-x-[158px] h-[39px] w-[158px] text-[12px] border-[1px] border-black font-[helvetica] rounded-[35px]   hover:cursor-pointer`}
                >
                  {collectButtonContent}
                </button>
                <div className="ml-[23px] text-black font-IBMPlexMono">
                  {totalSupply}&nbsp;minted
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <div>invalid file type</div>;
  }
};

export default ListingPage;
