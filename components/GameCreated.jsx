import Lottie from "lottie-react";
import checkMarkAnimation from "@/animations/3.json"
import Link from "next/link";

const GameCreated = ({gameId}) => {

    return(
        <div className={"loadingFlex"}>
            <div><div className={"loadingHeader"}>50/50 Created</div>
            <div className={"loadingSubheader"}>Transaction successful</div></div>
            <Lottie animationData={checkMarkAnimation} loop={false} style={{
                width:"100px"
            }} />
            <Link href={`/${gameId}`}><div><div className={"loadingHash"}>{`50-50.IO/${gameId}`}</div>
            <div className={"loadingHashSub"}>Game Link</div></div></Link>
        </div>
    )
}

export default GameCreated