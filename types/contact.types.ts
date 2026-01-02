export interface ContactSettings {
    id: number;
    location: string;
    phone_primary: string;
    phone_secondary: string | null;
    whatsapp: string;
    email: string;
    map_link: string | null;
}
