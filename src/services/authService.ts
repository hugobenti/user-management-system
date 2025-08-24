export interface SignUpRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface ApiUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

class AuthService {
  private readonly MOCK_TOKEN = "reqres-free-v1";

  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    console.info("[AuthService:signUp MOCK] payload:", {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
    });

    const user = {
      id: 1,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
    };

    return { token: this.MOCK_TOKEN, user };
  }

  async signIn(data: SignInRequest): Promise<AuthResponse> {
    console.info("[AuthService:signIn MOCK] payload:", {
      email: data.email,
    });

    const user = {
      id: 1,
      email: data.email,
      first_name: data.email,
      last_name: "User",
    };

    return { token: this.MOCK_TOKEN, user };
  }
}

export const authService = new AuthService();
