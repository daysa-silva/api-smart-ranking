import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import { DesafioStatus } from '../enums/desafio-status.enum';

export class AtualizarDesafioDto {
  @IsOptional()
  @IsNotEmpty()
  status: DesafioStatus;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  dataHoraDesafio: Date;
}
