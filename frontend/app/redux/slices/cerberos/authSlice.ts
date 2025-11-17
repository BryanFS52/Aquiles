import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { clientLAN } from "@lib/apollo-client";
import { GET_AUTH_TOKEN, LOGIN, LOGOUT } from "@graphql/cerberos/authGraph";
import type { User } from "@graphql/generated";

// Interfaces
interface AuthData {
  token: string;
  user: User;
}

interface AuthError {
  code: string | number;
  message: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  cerberosToken: string | null;
  cerberosUser: User | null;
  loading: boolean;
  error: AuthError | null;
}

// Async thunk para validar token de Cerberos
export const validateCerberosToken = createAsyncThunk<
  AuthData,
  string,
  { rejectValue: AuthError }
>(
  "auth/validateCerberosToken",
  async (token: string, { rejectWithValue }) => {
    console.log("🚀 [authSlice] validateCerberosToken iniciado");
    console.log("🔑 [authSlice] Token a validar:", token.substring(0, 30) + "...");

    try {
      console.log("📡 [authSlice] Llamando a GET_AUTH_TOKEN mutation...");
      const { data } = await clientLAN.mutate({
        mutation: GET_AUTH_TOKEN,
        variables: { token },
      });

      console.log("📦 [authSlice] Respuesta del servidor:", data);

      if (data.getAuthToken.code !== "200") {
        console.error("❌ [authSlice] Código de error del servidor:", data.getAuthToken.code);
        return rejectWithValue({
          code: data.getAuthToken.code,
          message: data.getAuthToken.message,
        });
      }

      // Guardar información en localStorage de Aquiles
      const authData: AuthData = {
        token: data.getAuthToken.token,
        user: data.getAuthToken.user,
      };

      console.log("💾 [authSlice] Datos a guardar:", authData);

      // Guardar en múltiples lugares para asegurar persistencia
      console.log("💾 [authSlice] Guardando en localStorage...");
      localStorage.setItem("aquiles_auth", JSON.stringify(authData));

      console.log("💾 [authSlice] Guardando en sessionStorage...");
      sessionStorage.setItem("aquiles_auth", JSON.stringify(authData));

      // También guardar en cookies como backup
      console.log("💾 [authSlice] Guardando en cookies...");
      const cookieValue = btoa(JSON.stringify(authData)); // Base64 encode
      document.cookie = `olympo_session=${cookieValue}; path=/; max-age=86400`; // 24 horas

      // Verificar que se guardó correctamente
      const verification = localStorage.getItem("aquiles_auth");
      console.log("🔍 [authSlice] Verificación localStorage:", verification ? "✅ GUARDADO" : "❌ NO GUARDADO");

      console.log("✅ [authSlice] validateCerberosToken completado exitosamente");
      return authData;
    } catch (error) {
      console.error("❌ [authSlice] Error en validateCerberosToken:", error);
      return rejectWithValue({
        code: 500,
        message: (error as Error).message,
      });
    }
  }
);

// Async thunk para logout
export const logoutUser = createAsyncThunk<
  any,
  void,
  { rejectValue: AuthError; state: { auth: AuthState } }
>(
  "auth/logout",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const { data } = await clientLAN.mutate({
        mutation: LOGOUT,
        variables: {
          idUser: auth.user?.id,
          token: auth.token,
        },
      });

      // Limpiar localStorage de Olympo
      localStorage.removeItem("aquiles_auth");

      return data.logout;
    } catch (error) {
      localStorage.removeItem("aquiles_auth");
      return rejectWithValue({
        code: 500,
        message: (error as Error).message,
      });
    }
  }
);

// Async thunk para cargar estado desde localStorage
export const loadAuthFromStorage = createAsyncThunk<
  AuthData | null,
  void,
  { rejectValue: AuthError }
>(
  "auth/loadAuthFromStorage",
  async (_, { rejectWithValue }) => {
    console.log("🔍 [authSlice] loadAuthFromStorage iniciado");

    try {
      let storedAuth: string | null = null;
      let source: string | null = null;

      // 1. Primero intentar localStorage
      console.log("📦 [authSlice] Buscando en localStorage...");
      const localData = localStorage.getItem("aquiles_auth");
      if (localData) {
        console.log("✅ [authSlice] Encontrado en localStorage");
        storedAuth = localData;
        source = "localStorage";
      } else {
        console.log("❌ [authSlice] No encontrado en localStorage");
      }

      // 2. Si no está en localStorage, buscar en sessionStorage
      if (!storedAuth) {
        console.log("📦 [authSlice] Buscando en sessionStorage...");
        const sessionData = sessionStorage.getItem("aquiles_auth");
        if (sessionData) {
          console.log("✅ [authSlice] Encontrado en sessionStorage");
          storedAuth = sessionData;
          source = "sessionStorage";
        } else {
          console.log("❌ [authSlice] No encontrado en sessionStorage");
        }
      }

      // 3. Si no está en ninguno, buscar en cookies
      if (!storedAuth) {
        console.log("📦 [authSlice] Buscando en cookies...");
        const cookieMatch = document.cookie.match(/olympo_session=([^;]+)/);
        if (cookieMatch) {
          try {
            const decoded = atob(cookieMatch[1]); // Base64 decode
            console.log("✅ [authSlice] Encontrado en cookies");
            storedAuth = decoded;
            source = "cookie";
          } catch (e) {
            console.error("❌ [authSlice] Error decodificando cookie:", e);
          }
        } else {
          console.log("❌ [authSlice] No encontrado en cookies");
        }
      }

      if (storedAuth) {
        console.log("✅ [authSlice] Auth data encontrada en:", source);
        const parsed: AuthData = JSON.parse(storedAuth);
        console.log("📦 [authSlice] Datos parseados:", parsed);

        // Restaurar en localStorage si se encontró en otro lugar
        if (source !== "localStorage") {
          console.log("💾 [authSlice] Restaurando en localStorage desde", source);
          localStorage.setItem("aquiles_auth", JSON.stringify(parsed));
        }

        return parsed;
      }

      console.warn("⚠️ [authSlice] No se encontró auth data en ningún lugar");
      return null;
    } catch (error) {
      console.error("❌ [authSlice] Error en loadAuthFromStorage:", error);
      // Limpiar todos los storages en caso de error
      localStorage.removeItem("aquiles_auth");
      sessionStorage.removeItem("aquiles_auth");
      document.cookie = "olympo_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return rejectWithValue({
        code: 500,
        message: "Error loading authentication data",
      });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    token: null,
    user: null,
    cerberosToken: null,
    cerberosUser: null,
    loading: false,
    error: null,
  } as AuthState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCerberosData: (state, action: PayloadAction<AuthData>) => {
      state.cerberosToken = action.payload.token;
      state.cerberosUser = action.payload.user;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.cerberosToken = null;
      state.cerberosUser = null;
      state.error = null;

      // Limpiar todos los storages
      localStorage.removeItem("aquiles_auth");
      sessionStorage.removeItem("aquiles_auth");
      document.cookie = "olympo_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },
  },
  extraReducers: (builder) => {
    builder
      // validateCerberosToken
      .addCase(validateCerberosToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateCerberosToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(validateCerberosToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = action.payload || null;
      })
      // logoutUser
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.cerberosToken = null;
        state.cerberosUser = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.cerberosToken = null;
        state.cerberosUser = null;
        state.error = action.payload || null;
      })
      // loadAuthFromStorage
      .addCase(loadAuthFromStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadAuthFromStorage.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.token = action.payload.token;
          state.user = action.payload.user;
        } else {
          state.isAuthenticated = false;
          state.token = null;
          state.user = null;
        }
      })
      .addCase(loadAuthFromStorage.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      });
  },
});

export const { clearError, setCerberosData, clearAuth } = authSlice.actions;
export default authSlice.reducer;