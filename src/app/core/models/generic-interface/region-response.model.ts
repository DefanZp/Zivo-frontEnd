import { Region } from "../region/region.model";

export interface RegionResponse {
    meta: {
        message: string;
        code: number;
        status: string;
    };
    data: Region[];
}