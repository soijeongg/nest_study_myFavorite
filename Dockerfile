FROM nest:alpine

# ARG로 변수 선언
ARG TYPEORM_SYNCHRONIZE
ARG TYPEORM_HOST
ARG TYPEORM_PORT
ARG TYPEORM_USERNAME
ARG TYPEORM_PASSWORD
ARG TYPEORM_DATABASE
ARG PORT
ARG TYPEORM_LOGGING
ARG JWT_SECRET
ARG JWT_REFRESH_SECRET

# ENV로 환경 변수 설정
ENV TYPEORM_SYNCHRONIZE=$TYPEORM_SYNCHRONIZE \
TYPEORM_HOST=$TYPEORM_HOST \
TYPEORM_PORT=$TYPEORM_PORT \
TYPEORM_USERNAME=$TYPEORM_USERNAME \
TYPEORM_PASSWORD=$TYPEORM_PASSWORD \
TYPEORM_DATABASE=$TYPEORM_DATABASE \
PORT=$PORT \
TYPEORM_LOGGING=$TYPEORM_LOGGING \
JWT_SECRET=$JWT_SECRET \
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET

LABEL creator="soi"
LABEL version="1.0"

WORKDIR /app

COPY ./package.json .
COPY ./yarn.lock .

# 패키지 설치
RUN  yarn install

# 메인 폴더의 내용을 전부 복사 

# 현재 디렉터리에 있는 파일들을 이미지 내부 /app 디렉터리에 추가함

ADD . /app

ARG TYPEORM_SYNCHRONIZE
ARG TYPEORM_HOST
ARG TYPEORM_PORT
ARG TYPEORM_USERNAME
ARG TYPEORM_PASSWORD
ARG TYPEORM_DATABASE
ARG PORT
ARG TYPEORM_LOGGING
ARG JWT_SECRET
ARG JWT_REFRESH_SECRET

ENV TYPEORM_SYNCHRONIZE=$TYPEORM_SYNCHRONIZE 
ENV TYPEORM_HOST=$TYPEORM_HOST 
ENV TYPEORM_PORT=$TYPEORM_PORT
ENV TYPEORM_USERNAME=$TYPEORM_USERNAME
ENV TYPEORM_PASSWORD=$TYPEORM_PASSWORD 
ENV TYPEORM_DATABASE=$TYPEORM_DATABASE 
ENV PORT=$PORT 
ENV TYPEORM_LOGGING=$TYPEORM_LOGGING 
ENV JWT_SECRET=$JWT_SECRET 
ENV JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET

CMD [ "yarn", "start" ]