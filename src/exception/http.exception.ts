import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Request, Response } from 'express';
@Catch(HttpException) //HttpException http 예외 처리
export class httpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    //예외 발생시 호출
    const ctx = host.switchToHttp(); //ArgumentsHost에서 http 컨텍스트 가져오기
    const response = ctx.getResponse<Response>(); //express의 응답객체 가져오기
    const status = exception.getStatus(); //상태코드 가져오기
    const request = ctx.getRequest<Request>(); //요청객체 가져오기
    const exceptionResponse: any = exception.getResponse(); //예외객체의 응답 객체 가져오기
    const message = exceptionResponse.message || exception.message;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString,
      path: request.url,
      message,
    });
  }
}
//에러가 발생했을떄 에러에 대한 코드와 시간 경로를 리턴
//ctx로 가져와야 한다
