import { IsInt, IsNumberString, IsString } from "class-validator";

export class CarpFilterDto {
    @IsString()
    majors: string | null;

    @IsString()
    years: string | null;

    @IsString()
    jobs: string | null;

    @IsNumberString()
    page: string;
}