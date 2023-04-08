export interface Course {
    id: number;
    name: string;
    studies: string[];
    year: number;
    dates: string[];
    teacher: number;
    nearestDate?: string;
}