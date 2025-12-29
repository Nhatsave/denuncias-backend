export class DenunciaEstadoRespostaDto {
  id_denuncia: number;
  descricao: string;
  status: string;
  ficheiro: string[];      // array de arquivos
  data_criacao: Date;      // tipo Date
  localizacao: string;
}
