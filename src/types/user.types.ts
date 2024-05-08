export interface UserParams {
  username?: string;
  password?: string;
  uid?: string;
  email?: string;
  useCases: UseCase[];
}

type UseCase = "DEFAULT" | "VERIFY_EMAIL" | "LOGIN";
