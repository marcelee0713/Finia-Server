declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT: string;
      REDIS_SECRETKEY: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
      DATABASE_URL: string;
      DEV_DATABASE_URL: string;
      SECRET_PROTOCOL: string;
      SECRET_DOMAIN: string;
      SECRET_EMAIL_PASSWORD: string;
      SECRET_EMAIL: string;
      SECRET_LOGIN_ROUTE: string;
      SECRET_RESET_PASS_ROUTE: string;
      REFRESH_TOKEN_SECRETKEY: string;
      ACCESS_TOKEN_SECRETKEY: string;
      EMAIL_VERIFICATION_SECRETKEY: string;
      PASSWORD_RESET_SECRETKEY: string;
      SET_ID_CHARACTERS: string;
      CLIENT_BASE_URL: string;
      ADMIN_USERNAME: string;
      ADMIN_PASSWORD: string;
      ADMIN_EMAIL_ADDRESS: string;
    }
  }
}

export {};
