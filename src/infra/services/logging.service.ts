import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';

@Injectable()
export class LoggingService {
  private prisma: PrismaService;
  constructor() {
    this.prisma = new PrismaService();
  }

  async logRequest(
    method: string,
    url: string,
    requestBody: any,
    params: any,
    responseBody: any,
    executionTime: number,
    fieldsToHide: string[] = [],
    userId?: string | null,
  ) {
    // Ocultando campos do corpo da solicitação e da resposta
    const hiddenRequestBody = this.hideFields({ ...requestBody }, fieldsToHide);
    const hiddenResponseBody = this.hideFields(
      { ...responseBody },
      fieldsToHide,
    );

    await this.prisma.log.create({
      data: {
        data: {
          userId,
          method,
          url,
          requestBody: hiddenRequestBody,
          params,
          responseBody: hiddenResponseBody,
          executionTime,
          tag: 'controller',
        },
      },
    });
  }

  async logError(
    method: string,
    url: string,
    requestBody: any,
    params: any,
    error: any,
    executionTime: number,
    fieldsToHide: string[] = [],
    userId?: string | null,
  ) {
    // Ocultando campos do corpo da solicitação e da resposta
    const hiddenRequestBody = this.hideFields({ ...requestBody }, fieldsToHide);

    await this.prisma.log.create({
      data: {
        data: {
          userId,
          method,
          url,
          requestBody: hiddenRequestBody,
          params,
          responseBody: null, // Não há resposta devido ao erro
          error: error.message, // Mensagem de erro
          executionTime,
          tag: 'controller',
        },
      },
    });
  }

  hideFields(data: any, fieldsToHide: string[]) {
    const hideNestedField = (obj: any, fieldPath: string[]) => {
      let currentObj = obj;
      for (const field of fieldPath.slice(0, -1)) {
        // Verifica se o objeto é válido antes de acessar a propriedade
        if (currentObj && currentObj.hasOwnProperty(field)) {
          currentObj = currentObj[field];
        } else {
          // Se o objeto for inválido ou a propriedade não existir, retorna sem fazer alterações
          return;
        }
      }
      const fieldToHide = fieldPath[fieldPath.length - 1];
      if (currentObj && currentObj.hasOwnProperty(fieldToHide)) {
        currentObj[fieldToHide] = '[hidden]';
      }
    };

    for (const fieldPathString of fieldsToHide) {
      const fieldPath = fieldPathString.split('.');
      hideNestedField(data, fieldPath);
    }
    return data;
  }
}
