export interface Wallet {
    id: number;
    user_id: number;
    balance: number;
    created_at: string;
    updated_at: string;
}

export interface Transaction {
    id: number;
    wallet_id: number;
    amount: number;
    type: 'deposit' | 'withdrawal' | 'purchase';
    description: string;
    created_at: string;
}
