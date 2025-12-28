import { getFeatures } from "@/actions/get-features";
import FeaturesClient from "./FeaturesClient";

const FeaturesServer = async () => {
    const features = await getFeatures();
    return <FeaturesClient features={features} />;
};

export default FeaturesServer;
