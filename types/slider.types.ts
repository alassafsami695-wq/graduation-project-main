export interface Slider {
    id: number;
    title: string;
    description: string;
    image: string;
    link?: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface SliderInput {
    title: string;
    description: string;
    image?: File | null;
    active: boolean;
}
