import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriasService } from 'src/categorias/categorias.service';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { DesafioStatus } from './enums/desafio-status.enum';
import { Desafio, Partida } from './interfaces/desafio.interface';

@Injectable()
export class DesafiosService {
  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
    @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
    private readonly jogadoresService: JogadoresService,
    private readonly categoriasService: CategoriasService,
  ) {}

  async criarDesafio(criaDesafioDto: CriarDesafioDto): Promise<Desafio> {
    const { solicitante, jogadores } = criaDesafioDto;

    //Os jogadores da requisicao realmente estão cadastrados na nossa base
    await this.jogadoresService.consultarJogadorPeloId(jogadores[0]._id);
    await this.jogadoresService.consultarJogadorPeloId(jogadores[1]._id);

    //O solicitante faz parte do desafio
    if (!jogadores.find(jogador => jogador._id === solicitante._id)) {
      throw new BadRequestException('Solicitante não faz parte do desafio');
    }

    //Solicitante pertence a alguma categoria?
    const categoriaSolicitante = await this.categoriasService.consultarCategoriaJogador(solicitante._id);

    const desafio = new this.desafioModel({
      ...criaDesafioDto,
      categoria: categoriaSolicitante,
      dataHoraSolicitacao: new Date(),
      status: DesafioStatus.PENDENTE
    })

    return await desafio.save()
  }

  async consultarTodosDesafios(): Promise<Desafio[]> {
    return await this.desafioModel.find({})
      .populate('jogadores')
      .populate('solicitante')
      .populate('partida');
  }

  async consultarTodosDesafiosDeUmJogador(idJogador): Promise<Desafio[]> {
    const jogador = await this.jogadoresService.consultarJogadorPeloId(idJogador);

    return await this.desafioModel.find({
      jogadores: { $in: [jogador] },
    }).populate('jogadores').populate('solicitante').populate('partida');
  }

  async consultarDesafioPeloId(id: string) {
    let desafioEncontrado = await this.desafioModel.findById(id)

    if (!desafioEncontrado) {
      throw new NotFoundException(`Desafio com ID ${id} não encontrado`);
    }

    desafioEncontrado = await desafioEncontrado.populate('jogadores');
    desafioEncontrado = await desafioEncontrado.populate('solicitante');
    return await desafioEncontrado.populate('partida');
  }

  async atualizarDesafio(id: string, atualizarDesafioDto: AtualizarDesafioDto) {
    const desafioEncontrado = await this.consultarDesafioPeloId(id);

    if (!['ACEITO', 'NEGADO', 'CANCELADO'].includes(atualizarDesafioDto.status)) {
        throw new BadRequestException("Status deve ser 'ACEITO', 'NEGADO' ou 'CANCELADO'")
    }

    await desafioEncontrado.updateOne({
      $set: 
      {
        ...atualizarDesafioDto,
        dataHoraResposta: atualizarDesafioDto.status? new Date() : undefined
      }
    })
  }

  async apagarDesafio(id: string): Promise<void> {
    const desafioEncontrado = await this.consultarDesafioPeloId(id);
    await desafioEncontrado.updateOne({$set: {status: DesafioStatus.CANCELADO}});
  }

  async atribuirDesafioPartida(id: string, atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto) {
    const desafioEncontrado = await this.consultarDesafioPeloId(id);

     if (!this.jogadorPertenceALista(desafioEncontrado, atribuirDesafioPartidaDto.def)) {
      throw new BadRequestException("Jogador vencedor deve fazer parte do desafio")
    }
    const partida = await this.partidaModel.create({
      ...atribuirDesafioPartidaDto,
      categoria: desafioEncontrado.categoria,
      jogadores: desafioEncontrado.jogadores
    })
    
    desafioEncontrado.status = DesafioStatus.REALIZADO;
    desafioEncontrado.partida = partida;

    try {
      await desafioEncontrado.save();
    } catch(error) {
      await this.partidaModel.deleteOne({_id: partida._id})
      throw new InternalServerErrorException()
    }
  }

  private jogadorPertenceALista(lista: {jogadores: Jogador[]}, jogador: Jogador): boolean {
    return lista.jogadores.find(jog => jog._id.toString() === jogador._id.toString()) !== undefined;
  }
}
