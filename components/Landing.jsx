import styles from "@/styles/Index.module.css";
import Link from "next/link";

const Landing = () => {

    return(
        <div className={styles.introWrap}>
        <div className={styles.header}>The future of fundraising</div>
        <div className={styles.introButtons}>
          <Link href={"/"}><div className={`${styles.introButton} ${styles.blackIntroBtn}`}>WhitePaper</div></Link>
          <Link href={"/create"}><div className={`${styles.introButton} ${styles.greenIntroBtn}`}>Create 50/50</div></Link>
        </div>
      </div>
    )
}

export default Landing