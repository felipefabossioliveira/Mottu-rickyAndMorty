import { Character } from "./character";

export interface ApiInfo {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
}

export interface CharacterApiResponse {
    info: ApiInfo;
    results: Character[];
}
