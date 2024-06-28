import formatETH from "@/functions/formatETH"
import styles from "@/styles/Game.module.css"

const LiveGameStats = ({gameInfo,endBlockTimeRemaining,revealBlockTimeRemaining}) => {

    return(
        <div className={styles.gameStats}>
            <div className={styles.statCont}>
            <div className={styles.key}>Pot</div>
                <div className={styles.value}>{formatETH((parseInt(gameInfo[1])/10**18).toString())} ETH</div>
            </div>
            <div className={styles.statCont}>
                <div className={styles.key}>Tickets Sold</div>
                <div className={styles.value}>{parseInt(gameInfo[3])}</div>
            </div>
            <div className={styles.statCont}>
                <div className={styles.key}>Sale Ends</div>
                <div className={styles.value}>{endBlockTimeRemaining}</div>
            </div>
            <div className={styles.statCont}>
                <div className={styles.key}>Winner Reveal</div>
                <div className={styles.value}>{revealBlockTimeRemaining}</div>
            </div>
        </div>
    )
}

export default LiveGameStats