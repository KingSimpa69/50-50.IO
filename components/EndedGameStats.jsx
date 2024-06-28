import formatETH from "@/functions/formatETH"
import styles from "@/styles/Game.module.css"
import { shortenEthAddy } from "@/functions/shortenEthAddy"
import Link from "next/link"
import config from "@/config.json"

const EndedGameStats = ({gameInfo,endBlockTimeRemaining,revealBlockTimeRemaining,winner}) => {

    return(
        <div className={styles.gameStats}>
            <div className={styles.statCont}>
                <div className={styles.statsContHeader}>Fundraiser</div>
                <Link target={"_blank"} href={`${config.blockExplorer}address/${gameInfo[5]}`}><div className={styles.key}>{shortenEthAddy(gameInfo[5])}</div></Link>
                <div className={styles.value}>{formatETH((parseInt(gameInfo[1])/2)/10**18)} ETH</div>
            </div>
            <div className={styles.statCont}>
                <div className={styles.statsContHeader}>Ticket Holder</div>
                <Link target={"_blank"} href={`${config.blockExplorer}address/${winner}`}><div className={styles.key}>{shortenEthAddy(winner)}</div></Link>
                <div className={styles.value}>{formatETH((parseInt(gameInfo[1])/2)/10**18)} ETH</div>
            </div>
        </div>
    )

}

export default EndedGameStats