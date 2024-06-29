import Games from "@/components/Games";
import Wrapper from "@/components/Wrapper";
import Landing from "@/components/Landing";
import Games1C from "@/components/Games1C";
import { useWindowSize } from "@/hooks/useWindowSize";

const Home = () => {

  const {width} = useWindowSize();

  return (
    <Wrapper>
      <Landing />
      {width<600?<Games1C />:<Games/>}
    </Wrapper>
  );
};

export default Home;
