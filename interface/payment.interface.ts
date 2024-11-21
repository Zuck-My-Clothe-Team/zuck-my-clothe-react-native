export interface IPaymentUpdate{
    payment_id: string,
    status: EPaymentStatus
}

export enum EPaymentStatus{
    pending = "Pending",
    paid = "Paid",
    expired = "Expired",
    cancel = "Cancel"
}