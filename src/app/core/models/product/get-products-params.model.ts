export interface GetProductsParams {
    search? : string;
    category? : number;
    sort? : string;
    direction? : 'asc' | 'desc';
    page? : number;
}