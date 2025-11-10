import { OrderItemModel } from "./order-item-model";

export interface CartItem extends OrderItemModel {
    name: string;
}
