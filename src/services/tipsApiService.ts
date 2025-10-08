import { TipFormData } from "@/src/types";

export interface ApiResponse {
  success: boolean;
  message: string;
  id?: string;
  error?: string;
}

export class TipsApiService {
  private static baseUrl = "/api/tips";

  static async createTip(tipData: TipFormData): Promise<ApiResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tipData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao criar palpite");
      }

      return result;
    } catch (error) {
      console.error("Erro na API:", error);
      throw error;
    }
  }

  static async updateTip(id: string, tipData: Partial<TipFormData>): Promise<ApiResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...tipData }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao atualizar palpite");
      }

      return result;
    } catch (error) {
      console.error("Erro na API:", error);
      throw error;
    }
  }
}
