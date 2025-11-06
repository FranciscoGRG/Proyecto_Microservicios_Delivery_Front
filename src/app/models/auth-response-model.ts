export interface AuthResponseModel {
    token: string;
    email: string;
    rol: 'USER' | 'ADMIN' | string;
}
