export enum HTTP_STATUS {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export const RESPONSE_MESSAGE: Record<number, string> = {
  [HTTP_STATUS.BAD_REQUEST]: '요청 형식이 올바르지 않습니다.',
  [HTTP_STATUS.UNAUTHORIZED]: '로그인이 필요합니다.',
  [HTTP_STATUS.FORBIDDEN]: '권한이 없습니다.',
  [HTTP_STATUS.NOT_FOUND]: '리소스를 찾을 수 없습니다.',
  [HTTP_STATUS.CONFLICT]: '요청 충돌이 발생했습니다.',
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]: '서버 오류가 발생했습니다.',
};

export type Rsp<T> = { statusCode: number; message: string; data: T };
