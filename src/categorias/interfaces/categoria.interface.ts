import { Document } from 'mongoose';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';

export interface Categoria extends Document {
  categoria: string;
  descricao: string;
  eventos: Evento[];
  jogadores: Jogador[];
}

export interface Evento {
  nome: string;
  operacao: string;
  valor: number;
}
