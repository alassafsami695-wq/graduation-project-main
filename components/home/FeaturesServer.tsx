import { getFeatures } from "@/actions/public/get-features";
import FeaturesClient from "./FeaturesClient";

const FeaturesServer = async () => {
    const features = await getFeatures();
    console.log(features);
    return <FeaturesClient features={features} />;
};

export default FeaturesServer;
