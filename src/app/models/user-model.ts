export interface UserModel {
    id: number;
    name: string;
    email: string;
    phone: string;
    rol: 'USER' | 'ADMIN' | string;
}
