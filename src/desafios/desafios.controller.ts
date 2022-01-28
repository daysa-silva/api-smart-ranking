import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio } from './interfaces/desafio.interface';

@Controller('/api/v1/desafios')
export class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(
    @Body() criaDesafioDto: CriarDesafioDto,
  ): Promise<Desafio> {
    return await this.desafiosService.criarDesafio(criaDesafioDto);
  }

  @Get()
  async consultarDesafios(
    @Query('idJogador') idJogador: string,
  ): Promise<Desafio[]> {
    if (idJogador) {
      return await this.desafiosService.consultarTodosDesafiosDeUmJogador(idJogador);
    } else {
      return await this.desafiosService.consultarTodosDesafios();
    }
  }

  @Get('/:id')
  async consultarDesafioPeloId(@Param('id') id: string): Promise<Desafio> {
    return await this.desafiosService.consultarDesafioPeloId(id);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async atualizarDesafio(
    @Param('id') id: string,
    @Body() atualizarDesafioDto: AtualizarDesafioDto,
  ): Promise<void> {
    await this.desafiosService.atualizarDesafio(id, atualizarDesafioDto);
  }

  @Delete('/:id')
  async apagarDesafio(@Param('id') id: string): Promise<void> {
    return await this.desafiosService.apagarDesafio(id);
  }

  @Post('/:id/partida')
  @UsePipes(ValidationPipe)
  async atribuirDesafioPartida(
    @Param('id') id: string,
    @Body() atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto,
  ): Promise<void> {
    await this.desafiosService.atribuirDesafioPartida(id, atribuirDesafioPartidaDto);
  }
}
