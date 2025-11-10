export interface OrderResponse {
    id: number;
    userEmail: string;
    status: string;
    totalPrice: number;
    createdAt: string;
    items: any[];
}
