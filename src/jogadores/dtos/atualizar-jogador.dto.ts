import { IsNotEmpty, IsOptional } from 'class-validator';

export class AtualizarJogadorDto {
  @IsOptional()
  @IsNotEmpty()
  readonly telefone: string;

  @IsOptional()
  @IsNotEmpty()
  readonly nome: string;
}
