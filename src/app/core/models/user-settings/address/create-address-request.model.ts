export interface CreateAddressRequest {
    recipient_name: string;
    phone: string;
    label: string;
    full_address: string;
    
    province_id: string;
    city_id: string;
    district_id: string;
    subdistrict_id?: string | null;

    postal_code: string;

    latitude?: number | null;
    longitude?: number | null;

    is_default: boolean;
}