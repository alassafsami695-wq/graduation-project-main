import { getContacts } from "@/actions/contact/get-contacts";
import FooterClient from "./FooterClient";

const FooterServer = async () => {
    const contacts = await getContacts();

    return <FooterClient contacts={contacts} />;
};

export default FooterServer;
