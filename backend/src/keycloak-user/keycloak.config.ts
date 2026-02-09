import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";

interface KeycloakTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  scope: string;
}

@Injectable()
export class KeycloakConfig {
  private readonly logger = new Logger(KeycloakConfig.name);
  private httpClient: AxiosInstance;
  private accessToken: string;
  private tokenExpiresAt: number;
  private readonly baseUrl: string;
  private readonly realm: string;

  constructor(private configService: ConfigService) {
    this.baseUrl =
      process.env.ENVIRONMENT === "local"
        ? "http://localhost:8080"
        : process.env.KEYCLOAK_BASE_URL;
    this.realm = process.env.KEYCLOAK_REALM || "staff-scheduler";

    this.httpClient = axios.create({
      baseURL: `${this.baseUrl}/admin/realms/${this.realm}`,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      await this.authenticate();
      this.logger.log("Keycloak HTTP client initialized successfully");
    } catch (error) {
      this.logger.error("Failed to initialize Keycloak HTTP client:", error);
      throw error;
    }
  }

  private async authenticate(): Promise<void> {
    try {
      const response = await axios.post<KeycloakTokenResponse>(
        `${this.baseUrl}/realms/master/protocol/openid-connect/token`,
        new URLSearchParams({
          grant_type: "password",
          client_id: "admin-cli",
          username: this.configService.get<string>(
            "KEYCLOAK_ADMIN_USERNAME",
            "admin",
          ),
          password: this.configService.get<string>("KEYCLOAK_ADMIN_PASSWORD"),
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiresAt =
        Date.now() + response.data.expires_in * 1000 - 30000; // 30 seconds

      // Update the default authorization header
      this.httpClient.defaults.headers.common["Authorization"] =
        `Bearer ${this.accessToken}`;
    } catch (error) {
      this.logger.error("Failed to authenticate with Keycloak:", error);
      throw error;
    }
  }

  async getHttpClient(): Promise<AxiosInstance> {
    await this.ensureValidToken();
    return this.httpClient;
  }

  private async ensureValidToken(): Promise<void> {
    if (!this.accessToken || Date.now() >= this.tokenExpiresAt) {
      await this.authenticate();
    }
  }

  async refreshToken() {
    try {
      await this.authenticate();
    } catch (error) {
      this.logger.error("Failed to refresh Keycloak token:", error);
      throw error;
    }
  }
}
