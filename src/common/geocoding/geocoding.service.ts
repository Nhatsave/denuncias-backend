// src/common/geocoding/geocoding.service.ts
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Localizacao } from '../interfaces/localizacao.interface';
import { ObterEnderecoDto } from './dto/localizacao.dto';

@Injectable()
export class GeocodingService {
  private readonly logger = new Logger(GeocodingService.name);
  private readonly nominatimUrl = 'https://nominatim.openstreetmap.org/reverse';

  /**
   * Obtém endereço completo a partir de coordenadas
   */
  async obterEnderecoPorCoordenadas(
    dto: ObterEnderecoDto,
  ): Promise<Localizacao> {
    const { latitude, longitude, zoom } = dto;

    try {
      this.logger.debug(
        `Buscando endereço para coordenadas: ${latitude}, ${longitude}`,
      );

      const response = await axios.get(this.nominatimUrl, {
        params: {
          lat: latitude,
          lon: longitude,
          format: 'json',
          addressdetails: 1,
          'accept-language': 'pt',
          zoom: zoom,
        },
        headers: {
          'User-Agent': 'SistemaDenuncias/1.0 (contacto@dominio.com)',
        },
        timeout: 10000, // 10 segundos timeout
      });

      const data = response.data;
      const address = data.address;

      // Mapeamento para Moçambique/Portugal
      const localizacao: Localizacao = {
        endereco: data.display_name || this.formatarEndereco(address),
        bairro:
          address.suburb ||
          address.neighbourhood ||
          address.village ||
          address.city_district,
        cidade: address.city || address.town || address.municipality,
        provincia: address.state || address.region,
        pais: address.country,
        codigoPostal: address.postcode,
        rua: address.road || address.street,
        numero: address.house_number,
        pontoReferencia: address.tourism || address.amenity,
        latitude,
        longitude,
      };

      this.logger.log(`Endereço encontrado: ${localizacao.endereco}`);
      return localizacao;

    } catch (error) {
      this.logger.error(
        `Erro no geocoding para (${latitude}, ${longitude}): ${error.message}`,
      );
      
      // Retorna localização básica se falhar
      return this.criarLocalizacaoFallback(latitude, longitude);
    }
  }

  /**
   * Versão simplificada (para uso rápido)
   */
  async obterEnderecoSimples(
    latitude: number,
    longitude: number,
  ): Promise<string> {
    const localizacao = await this.obterEnderecoPorCoordenadas({
      latitude,
      longitude,
    });
    return localizacao.endereco;
  }

  /**
   * Calcula distância entre duas coordenadas (em km)
   */
  calcularDistancia(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.grausParaRadianos(lat2 - lat1);
    const dLon = this.grausParaRadianos(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.grausParaRadianos(lat1)) *
        Math.cos(this.grausParaRadianos(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Valida se coordenadas estão em Moçambique (aproximadamente)
   */
  estaEmMocambique(latitude: number, longitude: number): boolean {
    // Bounding box aproximada de Moçambique
    return (
      latitude >= -26.868 &&
      latitude <= -10.471 &&
      longitude >= 30.217 &&
      longitude <= 40.844
    );
  }

  // ============ MÉTODOS PRIVADOS ============

  private formatarEndereco(address: any): string {
    const parts = [
      address.road,
      address.house_number ? `Nº ${address.house_number}` : null,
      address.neighbourhood,
      address.suburb,
      address.city,
      address.state,
      address.country,
    ].filter(Boolean);

    return parts.join(', ');
  }

  private criarLocalizacaoFallback(
    latitude: number,
    longitude: number,
  ): Localizacao {
    return {
      endereco: 'Localização não identificada',
      cidade: 'Desconhecida',
      provincia: 'Desconhecida',
      pais: 'Moçambique',
      latitude,
      longitude,
    };
  }

  private grausParaRadianos(graus: number): number {
    return graus * (Math.PI / 180);
  }
}