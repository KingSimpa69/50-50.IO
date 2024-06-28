import Image from "next/image"

const Footer = () => {

    return(
    <div className={"footer"}>
        <a target="_blank" href="https://github.com/"><Image alt={"git-logo"} src={"/images/git.svg"} width={20} height={20} /></a>
    </div>
    )
}

export default Footer