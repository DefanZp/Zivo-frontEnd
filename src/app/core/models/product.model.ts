import { Category } from "./category.model";

export interface Product {
    id: number;
    category_id: number;
    name: string;
    description: string;
    price: string;
    stock: number;
    image_path: string;
    created_at: string;
    updated_at: string;
    category: Category;
}