import { ItemPayload } from "./item-payload";

export interface OrderRequestPayload {
    items: ItemPayload[];
    paymentMethodToken: string;
}
