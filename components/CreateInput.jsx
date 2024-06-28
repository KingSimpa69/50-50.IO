import styles from "@/styles/Create.module.css"

const CreateInput = ({placeholder,title,value,inputID,handleInput,errors}) => {

    return(
        <div className={styles.createInput}>
            <div className={styles.inputBackdrop}><input onChange={(e)=>handleInput(e,inputID)} value={value} placeholder={placeholder}/></div>
            {errors[inputID] === "" ? <div className={styles.inputLabel}>{title}</div> : <div className={styles.inputLabelError}>{errors[inputID]}</div>}
        </div>
    )
}

export default CreateInput