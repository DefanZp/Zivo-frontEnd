export interface MidtransSnap {

    // membuka halaman pembayaran Midtrans
    pay(
        token: string,
        options?: {
            onSuccess?: (result: unknown) => void;
            onPending?: (result: unknown) => void;
            onError?: (result: unknown) => void;
            onClose?: () => void;
        }
    ): void;
}

declare global {
    interface Window {
        snap: MidtransSnap;
    }
}