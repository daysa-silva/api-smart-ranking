import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {

  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    private readonly jogadoresService: JogadoresService,
  ) {}

  async criarCategoria(criarCategoriaDto: CriarCategoriaDto): Promise<Categoria> {
    const { categoria } = criarCategoriaDto;

    const categoriaEncontrada = await this.categoriaModel.findOne({ categoria });

    if (categoriaEncontrada) {
        throw new BadRequestException(`Categoria já cadastrada`)
    }

    const categoriaCriada = new this.categoriaModel(criarCategoriaDto)
    return await categoriaCriada.save();
  }

  async consultarTodasCategorias(): Promise<Categoria[]> {
    return await this.categoriaModel.find({}).populate('jogadores');
  }

  async consultarCategoriaPeloNome(categoria: string): Promise<Categoria> {
    const categoriaEncontrada = await this.categoriaModel.findOne({ categoria });

    if (!categoriaEncontrada) {
        throw new NotFoundException(`Categoria ${categoria} não encontrada`)
    }

    return await categoriaEncontrada.populate('jogadores');
  }

  async consultarCategoriaJogador(idJogador: string): Promise<string> {
    const categorias = await this.categoriaModel.find({});
    const jogadorEncontrado = await this.jogadoresService.consultarJogadorPeloId(idJogador);
    let categoriaJogador;

    categorias.forEach((categoria) => {
      if ( this.jogadorPertenceALista(categoria, jogadorEncontrado) ) {
        categoriaJogador = categoria.categoria;
      }
    });

    if (!categoriaJogador) {
      throw new NotFoundException(`Jogador ${idJogador} não pertence a nenhuma categoria`)
    }

    return categoriaJogador;
  }

  async atualizarCategoria(categoria: string, atualizarcategoriaDto: AtualizarCategoriaDto): Promise<void> {
    const categoriaEncontrada = await this.consultarCategoriaPeloNome(categoria);
    await categoriaEncontrada.updateOne({ $set: atualizarcategoriaDto });
  }

  async atribuirCategoriaJogador(params: { categoria: string; idJogador: string }): Promise<void> {
    const { categoria, idJogador } = params;
    
    const categoriaEncontrada = await this.consultarCategoriaPeloNome(categoria);
    const jogadorEncontrado = await this.jogadoresService.consultarJogadorPeloId(idJogador);

    if (this.jogadorPertenceALista(categoriaEncontrada, jogadorEncontrado)) {
        throw new BadRequestException(`Jogador ${idJogador} já cadastrado na categoria ${categoria}`)
    }
    categoriaEncontrada.jogadores.push(jogadorEncontrado)
    await categoriaEncontrada.save()
  }

  private jogadorPertenceALista(lista: {jogadores: Jogador[]}, jogador: Jogador): boolean {
    return lista.jogadores.find(jog => jog._id.toString() === jogador._id.toString()) !== undefined;
  }
}
