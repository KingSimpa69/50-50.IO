import { shortenEthAddy } from "@/functions/shortenEthAddy"
import Link from "next/link"
import config from "@/config.json"

const LoadingFlex = ({hash}) => {

    return(
        <div className={"loadingFlex"}>
            <div><div className={"loadingHeader"}>Transaction processing</div>
            <div className={"loadingSubheader"}>One moment please...</div></div>
            <div className="loader"></div>
            <div><Link target={"_blank"} href={`${config.blockExplorer}tx/${hash}`}><div className={"loadingHash"}>{shortenEthAddy(hash)}</div></Link>
            <div className={"loadingHashSub"}>Tx Hash</div></div>
        </div>
    )
}

export default LoadingFlex