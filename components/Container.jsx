import styles from "@/styles/Create.module.css"
const Conatiner = ({ children }) => {

    return(
        <div className={styles.container}>
            {children}
        </div>
    )
}

export default Conatiner