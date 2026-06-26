import { apiFetch } from "../utils/api";
import type { ApiResponse, ProfileResponse, UploadPhotoResponse, UploadKtpResponse, UploadKkResponse, UpdateProfileRequest, UpdateProfileResponse, MeResponse } from "../types/api";

export const profileService = {

  getMe: async (): Promise<ApiResponse<MeResponse>> => {
    const response = await apiFetch("/me");
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },

  getProfile: async (): Promise<ApiResponse<ProfileResponse>> => {
    const response = await apiFetch("/profile");
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },

  uploadProfilePhoto: async (file: File): Promise<ApiResponse<UploadPhotoResponse>> => {
    const formData = new FormData();
    formData.append("foto", file);

    const response = await apiFetch("/profil/profil-picture", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },

  uploadKtp: async (file: File): Promise<ApiResponse<UploadKtpResponse>> => {
    const formData = new FormData();
    formData.append("ktp", file);

    const response = await apiFetch("/profil/ktp", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },

  uploadKk: async (file: File): Promise<ApiResponse<UploadKkResponse>> => {
    const formData = new FormData();
    formData.append("kk", file);

    const response = await apiFetch("/profile/kk", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },

  updateProfile: async (payload: UpdateProfileRequest): Promise<ApiResponse<UpdateProfileResponse>> => {
    const response = await apiFetch("/profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },
};
