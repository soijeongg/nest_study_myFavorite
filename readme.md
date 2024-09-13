# 🩷🩵 최애 자랑 프로젝트 myFavorite
 
## 프로젝트 개요
 사용자가 자신의 최애를 관리하고, 관련 포스트 및 댓글을 통해 소통할 수 있는 커뮤니티 기능을 제공합니다. 최애가 3D, 2D, 취미 카테고리로 구분되며, 아이돌, 배우 등의 서브 카테고리와 아이돌 그룹, 배우 등의 서서브 카테고리로 세분화됩니다. 사용자는 친구 요청, 좋아요, 댓글 알림 기능을 통해 다른 사용자들과 상호작용할 수 있으며, 익명으로도 활동할 수 있습니다.

## 주요 기능
### 최애 검색 및 등록
사용자는 최애를 검색하고 자신의 최애로 등록할 수 있습니다.
원하는 최애가 없을 경우 최애 등록을 요청할 수 있습니다.
최애는 카테고리(3D, 2D, 2.5D), 서브 카테고리(아이돌, 배우 등), 서서브 카테고리(아이돌 그룹, 배우 등)로 나누어집니다.

### 포스트 및 댓글 시스템
각 최애마다 사용자는 포스트와 댓글을 작성할 수 있습니다.
댓글에는 답댓글 기능이 있으며, 익명으로도 작성 가능합니다.
좋아요 수가 가장 많은 포스트는 각 서서브 카테고리의 인기글로 등록되며, 인기글 중 가장 좋아요를 많이 받은 최애는 인기 최애로 선정됩니다.
좋아요 수가 같을 경우 댓글 수로 인기글이 결정됩니다.

### 친구 관리
사용자는 친구 검색 및 친구 요청을 보낼 수 있습니다.
친구 요청을 수락하거나 거절할 수 있으며, 친구 목록을 관리할 수 있습니다.
친구 삭제 시 관계는 소프트 삭제 방식으로 처리됩니다.

### 알림 기능
웹소켓을 이용해 실시간으로 친구 요청, 댓글, 좋아요에 대한 알림을 받을 수 있습니다.

### ERD
<img src ="https://github.com/user-attachments/assets/9100d3e2-90b5-49c3-b389-42b524902a7b">

### api 명세서
[노션 api 명세서](https://pollen-experience-ed3.notion.site/d7049e6698444a04ad627e1bf5ed83da?pvs=4)

## 기술 스택
백엔드: nest.js
데이터베이스: MySQL
인증: JWT, passport, argon2,
웹소켓: socket.io

## 설치 및 실행방법
### 클론
```shell
git clone https://github.com/soijeongg/nest_study_myFavorite.git
```
### 종속성 설치 
```shell
yarn install
```
### env 파일 생성
```file
NODE_ENV=
PORT =3000
TYPEORM_HOST
TYPEORM_PORT=3306
TYPEORM_USERNAME=
TYPEORM_PASSWORD=
TYPEORM_DATABASE=
TYPEORM_SYNCHRONIZE=false
TYPEORM_LOGGING=false
JWT_SECRET=
JWT_REFRESH_SECRET =
```
### 서버 실행
```shell
yarn start
```