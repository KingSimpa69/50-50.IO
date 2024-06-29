import Image from "next/image"
import Link from "next/link"

const Footer = () => {

    return(
    <div className={"footer"}>
         <Link target={"_blank"} href={"https://github.com/KingSimpa69/50-50.IO"}><Image alt={"git-logo"} src={"/images/git.svg"} width={20} height={20} /></Link>
    </div>
    )
}

export default Footer