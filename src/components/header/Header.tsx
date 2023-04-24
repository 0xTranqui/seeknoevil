import Link from "next/link";

export const Header = () => {
    return (



        // <div className=" flex flex-row justify-center sm:justify-start flex-wrap fixed text-[15px] top-[20px] w-full">
        //     <div className="flex flex-row sm:ml-[38px] justify-start flex-wrap w-[360px] sm:w-[500px] md:w-[625px]"></div>

        <div className="  flex flex-row justify-start ml-[16px] sm:justify-start fixed flex-wrap text-[15px] top-[20px] w-full z-10">
            <div className="tracking-[0px] flex flex-row justify-start flex-wrap">
                <Link className="underline" href="/"><u>seeknoevil</u></Link>
                &nbsp;is a blog created by&nbsp;
                <a className="hover:underline" href="https://twitter.com/ioeylim">
                    joey lim
                </a>
                &nbsp;and&nbsp;
                <a className="hover:underline" href="https://twitter.com/0xTranqui">
                    max bochman
                </a>
            </div>

        </div>
    );
};
