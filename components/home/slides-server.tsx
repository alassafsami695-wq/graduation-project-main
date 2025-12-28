import SlidesClient from "./slides-client";
import { getAds } from "@/actions/slides/get-slides";

const SlidesServer = async () => {
    const slides = await getAds();
    console.log(slides);
    return <SlidesClient slides={slides} />;

};

export default SlidesServer;
