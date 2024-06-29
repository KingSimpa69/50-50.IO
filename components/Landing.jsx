import styles from "@/styles/Index.module.css";
import Link from "next/link";

const Landing = () => {

    return(
        <div className={styles.introWrap}>
        <div className={styles.header}>The future of fundraising</div>
        <div className={styles.introButtons}>
          <Link target={"_blank"} href={"https://github.com/KingSimpa69/50-50.IO"}><div className={`${styles.introButton} ${styles.blackIntroBtn}`}>Source</div></Link>
          <Link href={"/create"}><div className={`${styles.introButton} ${styles.greenIntroBtn}`}>Create 50/50</div></Link>
        </div>
      </div>
    )
}

export default Landing