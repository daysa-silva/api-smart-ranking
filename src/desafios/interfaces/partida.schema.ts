import * as mongoose from 'mongoose';

export const PartidaSchema = new mongoose.Schema(
  {
    categoria: { type: String },
    jogadores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Jogador' }],
    def: { type: mongoose.Schema.Types.ObjectId, ref: 'Jogador' },
    partida: { type: mongoose.Schema.Types.ObjectId, ref: 'Partida' },
    resultado: [{ set: { type: String } }],
  },
  { timestamps: true, collection: 'partidas' },
);
