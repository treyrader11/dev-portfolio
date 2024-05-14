import Curve from "@/components/Layout/Curve";
import Inner from "@/components/Layout/Inner";
import ContainerBlock from "@/components/ContainerBlock";
import AboutMe from "@/components/AboutMe";

export default function About() {
  return (
    <Inner backgroundColor="#934E00">
      {/* <ContainerBlock> */}
      <AboutMe />
      <AboutMe />
      {/* </ContainerBlock> */}
    </Inner>
  );
}
