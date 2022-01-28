import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';
import { Evento } from '../interfaces/categoria.interface';

export class AtualizarCategoriaDto {
  @IsOptional()
  @IsString()
  descricao: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  eventos: Evento[];
}
