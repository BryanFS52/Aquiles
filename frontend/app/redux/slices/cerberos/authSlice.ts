import { clientLAN } from '@lib/apollo-client'
import { LOGIN, LOGOUT, FORGOT_PASSWORD, UPDATE_PASSWORD, GET_AUTH_TOKEN } from "@graphql/cerberos/authGraph";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { startRefreshTokenCycle, stopRefreshTokenCycle } from "@/app/services/refreshTokenService";
import type { LoginRequestDto, LoginResponseDto, User } from "@graphql/generated";

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const part = parts.pop();
    return part?.split(';').shift() || null;
  }
  return null;
};

const setCookie = (name: string, value: string, days: number = 7): void => {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Domain=.localhost; Max-Age=${maxAge}; SameSite=Lax`;
};

const clearAuthCookies = (): void => {
  const authCookieNames = [
    'auth_token', 'auth_userName', 'auth_userLastname', 'auth_user_document',
    'auth_user_id', 'auth_userRoles', 'auth_refreshToken'
  ];
  
  authCookieNames.forEach(cookieName => {
    document.cookie = `${cookieName}=; Path=/; Domain=.localhost; Max-Age=0; SameSite=Lax`;
  });
};

// Login user
export const loginUser = createAsyncThunk<LoginResponseDto,LoginRequestDto,
  { rejectValue: { message: string } }
>(
  "auth/loginUser",
  async (loginInput, { rejectWithValue }) => {
    try {
      const { data } = await clientLAN.mutate({
        mutation: LOGIN,
        variables: { input: loginInput },
      });
      if (!data.login || data.login.code !== "200" || !data.login.token) {
        return rejectWithValue({ message: data.login?.message || "Credenciales inválidas" });
      }
      return data.login;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const logoutUser = createAsyncThunk<
  boolean,
  { idUser: string; token: string },
  { rejectValue: { message: string } }
>(
  "auth/logoutUser",
  async ({ idUser, token }, { rejectWithValue }) => {
    try {
      const { data } = await clientLAN.mutate({
        mutation: LOGOUT,
        variables: { idUser, token },
      });
      if (!data.logout) {
        return rejectWithValue({ message: "Error al cerrar sesión" });
      }
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return rejectWithValue({ message: errorMessage });
    }
  }
);

// Forgot Password
export const forgotPasswordUser = createAsyncThunk<
  { code?: string | null; message?: string | null },
  string,
  { rejectValue: { message: string } }
>(
  "auth/forgotPasswordUser",
  async (document, { rejectWithValue }) => {
    try {
      const { data } = await clientLAN.mutate({
        mutation: FORGOT_PASSWORD,
        variables: { document },
      });
      if (!data.forgotPassword || data.forgotPassword.code !== "200") {
        return rejectWithValue({ message: data.forgotPassword?.message || "Error al recuperar contraseña" });
      }
      return data.forgotPassword;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return rejectWithValue({ message: errorMessage });
    }
  }
);

// Update Password
export const updatePasswordUser = createAsyncThunk<
  { code?: string | null; message?: string | null },
  { document: string; newPassword: string; confirmPassword: string },
  { rejectValue: { message: string } }
>(
  "auth/updatePasswordUser",
  async (input, { rejectWithValue }) => {
    try {
      const { data } = await clientLAN.mutate({
        mutation: UPDATE_PASSWORD,
        variables: { input },
      });
      if (!data.updatePassword || data.updatePassword.code !== "200") {
        return rejectWithValue({ message: data.updatePassword?.message || "Error al actualizar contraseña" });
      }
      return data.updatePassword;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return rejectWithValue({ message: errorMessage });
    }
  }
);

// Get Auth Token
export const getAuthToken = createAsyncThunk<
  LoginResponseDto,
  string,
  { rejectValue: { message: string } }
>(
  "auth/getAuthToken",
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await clientLAN.mutate({
        mutation: GET_AUTH_TOKEN,
        variables: { token },
      });
      if (!data.getAuthToken || data.getAuthToken.code !== "200") {
        return rejectWithValue({ message: data.getAuthToken?.message || "Token inválido" });
      }
      return data.getAuthToken;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return rejectWithValue({ message: errorMessage });
    }
  }
);

interface AuthState {
  user: User | null;
  token: string | null | undefined;
  refreshToken: string | null | undefined;
  loading: boolean;
  error: string | null | undefined;
  name: string | null | undefined;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
  name: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.name = null;
      state.error = null;
      if (typeof window !== 'undefined') {
        const currentTheme = getCookie('auth_theme') || 'light';
        clearAuthCookies();
        sessionStorage.removeItem('session_initialized');
        document.cookie = `auth_theme=${currentTheme}; Path=/; Domain=.localhost; Max-Age=2592000; SameSite=Lax`;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        
        if (action.payload.user) {
          state.user = action.payload.user;
          state.name = action.payload.user?.person?.name || null;
        }
        
        // Guardar en cookies y localStorage
        if (typeof window !== 'undefined') {
          // Guardar en cookies
          if (action.payload.token) {
            setCookie('auth_token', action.payload.token);
          }
          if (action.payload.refreshToken) {
            setCookie('auth_refreshToken', action.payload.refreshToken);
          }
          if (action.payload.user) {
            setCookie('auth_user_id', action.payload.user.id || '');
            
            if (action.payload.user.person) {
              setCookie('auth_userName', action.payload.user.person.name || '');
              setCookie('auth_userLastname', action.payload.user.person.lastname || '');
              setCookie('auth_user_document', action.payload.user.person.document || '');
            }
            
            if (action.payload.user.roles) {
              setCookie('auth_userRoles', JSON.stringify(action.payload.user.roles));
            }
          }
          
          // Guardar en localStorage también
          if (action.payload.token) {
            localStorage.setItem('token', action.payload.token);
          }
          if (action.payload.user) {
            localStorage.setItem('id', action.payload.user?.id || "");
            
            if (action.payload.user?.processDetails) {
              localStorage.setItem('processDetails', JSON.stringify(action.payload.user.processDetails));
            }
            
            if (action.payload.user?.person) {
              localStorage.setItem('userName', action.payload.user.person.name || '');
              localStorage.setItem('userLastname', action.payload.user.person.lastname || '');
              localStorage.setItem('userPhoto', action.payload.user.person.photo || '');
            }
            
            if (action.payload.user?.roles) {
              localStorage.setItem('userRoles', JSON.stringify(action.payload.user.roles));
            }
          }
          
          // Marcar sesión como inicializada
          sessionStorage.setItem('session_initialized', 'true');
          
          // Iniciar el ciclo de refresh token
          if (action.payload.refreshToken) {
            startRefreshTokenCycle(action.payload.refreshToken);
          }
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload?.message || action.error?.message || 'Error desconocido';
        state.loading = false;
      }).addCase(logoutUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.name = null;
      state.loading = false;
      state.error = null;
      if (typeof window !== 'undefined') {
        const currentTheme = getCookie('auth_theme') || 'light';
        clearAuthCookies();
        // Limpiar también la marca de sesión inicializada para mostrar "Iniciando sesión..." en el próximo login
        sessionStorage.removeItem('session_initialized');
        document.cookie = `auth_theme=${currentTheme}; Path=/; Domain=.localhost; Max-Age=2592000; SameSite=Lax`;
        stopRefreshTokenCycle();
      }
    })
    .addCase(logoutUser.rejected, (state, action) => {
      state.error = action.payload?.message || action.error?.message || 'Error desconocido';
      state.loading = false;
    })
    .addCase(forgotPasswordUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(forgotPasswordUser.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    })
    .addCase(forgotPasswordUser.rejected, (state, action) => {
      state.error = action.payload?.message || action.error?.message || 'Error desconocido';
      state.loading = false;
    })
    .addCase(updatePasswordUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updatePasswordUser.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    })
    .addCase(updatePasswordUser.rejected, (state, action) => {
      state.error = action.payload?.message || action.error?.message || 'Error desconocido';
      state.loading = false;
    })
    .addCase(getAuthToken.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getAuthToken.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      if (action.payload.token) {
        state.token = action.payload.token;
      }
      if (action.payload.user) {
        state.user = action.payload.user;
        state.name = action.payload.user?.person?.name || null;
      }
      
      if (typeof window !== 'undefined') {
        if (action.payload.token) {
          localStorage.setItem('token', action.payload.token);
        }
        if (action.payload.user) {
          localStorage.setItem('id', action.payload.user?.id || "");
          
          if (action.payload.user?.processDetails) {
            localStorage.setItem('processDetails', JSON.stringify(action.payload.user.processDetails));
          }
          
          if (action.payload.user?.person) {
            localStorage.setItem('userName', action.payload.user.person.name || '');
            localStorage.setItem('userLastname', action.payload.user.person.lastname || '');
            localStorage.setItem('userPhoto', action.payload.user.person.photo || '');
          }
          
          if (action.payload.user?.roles) {
            localStorage.setItem('userRoles', JSON.stringify(action.payload.user.roles));
          }
        }
      }
    })
    .addCase(getAuthToken.rejected, (state, action) => {
      state.error = action.payload?.message || action.error?.message || 'Error desconocido';
      state.loading = false;
      if (action.payload?.message?.includes('Token inválido') || action.payload?.message?.includes('inválido')) {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.name = null;
        if (typeof window !== 'undefined') {
          const currentTheme = getCookie('auth_theme') || 'light';
          clearAuthCookies();
          // Limpiar también la marca de sesión inicializada cuando el token es inválido
          sessionStorage.removeItem('session_initialized');
          document.cookie = `auth_theme=${currentTheme}; Path=/; Domain=.localhost; Max-Age=2592000; SameSite=Lax`;
        }
      }
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;