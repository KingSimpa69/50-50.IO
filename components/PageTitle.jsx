import styles from "@/styles/Create.module.css"
const PageTitle = ({ children }) => {

    return(
        <div className={styles.h1}>
            {children}
        </div>
    )
}

export default PageTitle