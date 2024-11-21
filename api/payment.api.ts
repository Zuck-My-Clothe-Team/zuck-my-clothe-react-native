import { axiosInstance } from '@/hooks/axiosInstance';
import { IPaymentUpdate } from './../interface/payment.interface';

export async function UpdatePayment(payment_detail:IPaymentUpdate) {
    try {
        const axios = await axiosInstance();
        const result = await axios.put(`/payment/update/${payment_detail.payment_id}/setstatus/${payment_detail.status}`);
        return result;
    } catch (error) {
        console.error("Error during update payment:", error);
        throw error;
    }
}