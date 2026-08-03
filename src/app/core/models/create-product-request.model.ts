export interface CreateProductRequest {
    name: string;
    description: string;
    price: number;
    stock: number;
    category_id: number;
    image_path: string;
}