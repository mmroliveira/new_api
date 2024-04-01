declare namespace Express {
  export interface Response {
    handleError: (message: string, status: number) => void;
  }

  export interface Request {
    user_id: string;
    user_name: string;
  }
}
