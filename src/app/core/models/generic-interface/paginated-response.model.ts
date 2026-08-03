export interface PaginatedResponse<T>{
    current_page: number,
    data: T[],
    first_page_url: string,
    last_page: number,
    per_page: number,
    total: number,
}