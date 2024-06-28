import styles from "@/styles/Header.module.css"
import Image from "next/image"
import Web3Button from "./Web3Button"
import Link from "next/link"

const Header = () => {

    return(
        <div className={styles.headerWrap}>
            <div className={styles.logoText}><Link href={"/"}>50-50.IO</Link><span id="cursor">_</span></div>
            <Web3Button />
        </div>
    )
}

export default Header