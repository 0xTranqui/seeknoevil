import Link from "next/link";

export const Header = () => {
    return (
        <div className=" flex flex-row justify-start ml-[16px] sm:justify-start flex-wrap absolute text-[15px] top-[20px] w-full z-10">
            <div className="flex flex-row justify-start flex-wrap">
                <Link className="underline" href="/"><u>seeknoevil</u></Link>
                &nbsp;is a blog created by&nbsp;
                <a className="underline" href="https://twitter.com/ioeylim">
                    joey lim
                </a>
                &nbsp;and&nbsp;
                <a className="underline" href="https://twitter.com/0xTranqui">
                    max bochman
                </a>
            </div>

        </div>
    );
};
