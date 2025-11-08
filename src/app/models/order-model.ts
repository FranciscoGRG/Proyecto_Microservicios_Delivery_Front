import { OrderItemModel } from "./order-item-model";

export interface OrderModel {
    id: number;
    userEmail: string;
    status: 'PENDING'| 'COMPLETED'| 'CANCELED' | string;
    totalPrice: number;
    createdAt: string;
    items: OrderItemModel[];
}
