import CreateGame from "@/components/CreateGame"
import PageTitle from "@/components/PageTitle"
import Wrapper from "@/components/Wrapper"

const Create = ({alert}) => {

    return(
        <Wrapper>
            <PageTitle>Create A 50/50</PageTitle>
            <CreateGame alert={alert} />
        </Wrapper>
    )
}

export default Create