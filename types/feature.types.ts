export interface Feature {
    id: number;
    title: string;
    description: string;
    icon: string;
    created_at: string;
    updated_at: string;
}

export interface FeatureInput {
    title: string;
    description: string;
    icon: string;
}
