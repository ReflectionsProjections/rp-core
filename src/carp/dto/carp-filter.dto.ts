import { IsInt } from "class-validator";

export class CarpFilterDto {
    majors: string | null;
    years: string | null;
    jobs: string | null;

    @IsInt()
    page: number | null;
}