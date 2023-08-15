import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateAttendeeDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['yes', 'no'])
  isCollegeStudent: string;

  @IsString()
  @IsIn(['yes', 'no'])
  isUIUCStudent: string;

  @ValidateIf((o) => o.isCollegeStudent === 'yes')
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  major: string;

  @ValidateIf((o) => o.isCollegeStudent === 'yes' && o.major === 'N/A')
  @IsString()
  @MaxLength(50)
  majorOther: string | null;

  @ValidateIf((o) => o.isCollegeStudent === 'yes' && o.isUIUCStudent === 'no')
  @IsNotEmpty()
  @MaxLength(100)
  collegeName: string;

  @ValidateIf((o) => o.isCollegeStudent === 'yes')
  @IsString()
  @IsIn(['Fall', 'Spring', 'Summer'])
  expectedGradTerm: string;

  @ValidateIf((o) => o.isCollegeStudent === 'yes')
  @IsNotEmpty()
  @IsNumberString()
  expectedGradYear: string;

  @IsOptional()
  @IsPositive()
  age: number | null;

  @IsOptional()
  @MaxLength(30)
  gender: string | null;

  @IsOptional()
  @MaxLength(30)
  ethnicity: string | null;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(7)
  race: [{ type: string }];

  @IsOptional()
  @MaxLength(30)
  raceOther: string;

  @IsOptional()
  @IsString()
  @IsIn(['yes', 'no', 'preferNotToSay'])
  firstGen: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  food: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3)
  @MaxLength(30, {
    each: true,
  })
  jobTypeInterest: [{ type: string }];

  @IsOptional()
  @MaxLength(200)
  portfolioLink: string | null;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(2)
  @MaxLength(30, {
    each: true,
  })
  mechPuzzle: [{ type: string }];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @MaxLength(30, {
    each: true,
  })
  marketing: [{ type: string }];

  @IsOptional()
  @IsString()
  @MaxLength(30)
  marketingOther: string;
}
