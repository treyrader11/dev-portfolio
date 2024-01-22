import Curve from "@/components/Layout/Curve";
import Inner from "@/components/Layout/Inner";

export default function Contact() {
  return (
    // <Curve backgroundColor={"#BCF366"} className="">
    <Inner className="bg-red-500">
      <h1>About</h1>
      <section className={""}>
        <p>
          Nullam mattis mattis dictum. Praesent sit amet condimentum mi, quis
          venenatis lectus. Phasellus ac ante id purus viverra hendrerit quis at
          ex. Donec vitae augue pulvinar augue dictum fermentum dapibus nec
          tellus.
        </p>
        <p>
          Phasellus cursus, ante in eleifend vehicula, leo metus mattis est, sit
          amet dignissim dui nibh in dui. Nullam dictum tortor vitae quam
          condimentum, eget tincidunt nisi tincidunt. Praesent ut erat at purus
          gravida aliquam non a purus. Pellentesque sagittis in justo vel
          venenatis.
        </p>
      </section>
    </Inner>
  );
}
