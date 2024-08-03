import {
  BadRequestException,
  ValidationPipe,
  ValidationError,
} from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  createExceptionFactory() {
    //사용자 정의 메시지 위해 사용
    return (validationErrors: ValidationError[] = []) => {
      const messages = validationErrors.map(
        (error) =>
          `${error.property} has wrong value ${error.value}, ${Object.values(error.constraints).join(', ')}`,
      ); //순회하면서 검사 에러가 왜 실패했는지
      return new BadRequestException({
        statusCode: 400,
        message: messages,
      });
    };
  }
}
