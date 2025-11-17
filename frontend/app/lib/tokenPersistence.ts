/**
 * 🔐 TOKEN PERSISTENCE UTILITY
 * ═════════════════════════════════════════════════
 * Maneja la persistencia de tokens entre dominios
 * Cerberos (SSO) → Aquiles
 */

export interface AuthData {
  token: string;
  timestamp: number;
  user: {
    id: string;
    person: {
      name: string;
      lastname: string;
      document: string;
    };
    roles: Array<{ name: string }>;
  };
  source: string;
}

/**
 * Guardar token en localStorage de Aquiles
 */
export const saveTokenToAquiles = (token: string, source: string = "manual"): boolean => {
  try {
    console.log(`📝 [TokenPersistence] Guardando token de ${source}...`);

    const authData: AuthData = {
      token,
      timestamp: Date.now(),
      user: {
        id: "temp",
        person: {
          name: "Usuario",
          lastname: "Temporal",
          document: "",
        },
        roles: [{ name: "Usuario" }],
      },
      source,
    };

    // Guardar objeto completo
    localStorage.setItem("aquiles_auth", JSON.stringify(authData));

    // Guardar token como string también (backup)
    localStorage.setItem("aquiles_token", token);

    // Guardar timestamp
    localStorage.setItem("aquiles_auth_timestamp", Date.now().toString());

    console.log("✅ [TokenPersistence] Token guardado exitosamente");
    console.log(`✅ [TokenPersistence] Fuente: ${source}`);
    console.log(`✅ [TokenPersistence] Timestamp: ${Date.now()}`);

    return verifyTokenInStorage();
  } catch (error) {
    console.error("❌ [TokenPersistence] Error guardando token:", error);
    return false;
  }
};

/**
 * Obtener token de localStorage
 */
export const getTokenFromStorage = (): string | null => {
  try {
    // Intentar obtener del objeto completo primero
    const authData = localStorage.getItem("aquiles_auth");
    if (authData) {
      const parsed = JSON.parse(authData);
      if (parsed.token) {
        console.log("✅ [TokenPersistence] Token obtenido de aquiles_auth");
        return parsed.token;
      }
    }

    // Fallback: obtener el token como string
    const token = localStorage.getItem("aquiles_token");
    if (token) {
      console.log("✅ [TokenPersistence] Token obtenido de aquiles_token");
      return token;
    }

    console.warn("⚠️ [TokenPersistence] No hay token en storage");
    return null;
  } catch (error) {
    console.error("❌ [TokenPersistence] Error obteniendo token:", error);
    return null;
  }
};

/**
 * Verificar que el token está en localStorage
 */
export const verifyTokenInStorage = (): boolean => {
  try {
    const token = getTokenFromStorage();
    const hasAuth = !!localStorage.getItem("aquiles_auth");
    const hasToken = !!localStorage.getItem("aquiles_token");

    const isValid = token !== null && (hasAuth || hasToken);

    console.log("🔍 [TokenPersistence] Verificación de storage:", {
      tokenExists: !!token,
      aquiles_auth: hasAuth,
      aquiles_token: hasToken,
      valid: isValid,
      timestamp: localStorage.getItem("aquiles_auth_timestamp"),
    });

    return isValid;
  } catch (error) {
    console.error("❌ [TokenPersistence] Error verificando token:", error);
    return false;
  }
};

/**
 * Limpiar token de localStorage
 */
export const clearTokenFromStorage = (): void => {
  try {
    console.log("🗑️ [TokenPersistence] Limpiando tokens de storage...");
    localStorage.removeItem("aquiles_auth");
    localStorage.removeItem("aquiles_token");
    localStorage.removeItem("aquiles_auth_timestamp");
    sessionStorage.removeItem("aquiles_auth");
    console.log("✅ [TokenPersistence] Tokens limpiados");
  } catch (error) {
    console.error("❌ [TokenPersistence] Error limpiando tokens:", error);
  }
};

/**
 * Obtener auth data completa
 */
export const getAuthDataFromStorage = (): AuthData | null => {
  try {
    const authData = localStorage.getItem("aquiles_auth");
    if (authData) {
      return JSON.parse(authData);
    }
    return null;
  } catch (error) {
    console.error("❌ [TokenPersistence] Error obteniendo auth data:", error);
    return null;
  }
};

/**
 * Verificar si el token es válido
 */
export const isTokenValid = (): boolean => {
  const token = getTokenFromStorage();
  if (!token) return false;

  // Token debe tener longitud mínima (típicamente JWT tiene 100+ caracteres)
  if (token.length < 50) {
    console.warn("⚠️ [TokenPersistence] Token muy corto:", token.length);
    return false;
  }

  return true;
};

/**
 * Verificar edad del token
 */
export const getTokenAge = (): number | null => {
  try {
    const timestamp = localStorage.getItem("aquiles_auth_timestamp");
    if (!timestamp) return null;

    const age = Date.now() - parseInt(timestamp);
    console.log(`📊 [TokenPersistence] Antigüedad del token: ${age}ms (${Math.round(age / 1000)}s)`);
    return age;
  } catch (error) {
    console.error("❌ [TokenPersistence] Error obteniendo antigüedad:", error);
    return null;
  }
};

/**
 * Debug: mostrar estado completo de storage
 */
export const debugStorageState = (): void => {
  console.log("🔍 [TokenPersistence] ═══════════════════════════════════════");
  console.log("🔍 [TokenPersistence] DEBUG - Estado de Storage");
  console.log("🔍 [TokenPersistence] ═══════════════════════════════════════");

  // localStorage
  console.log("📦 localStorage items:", {
    aquiles_auth: localStorage.getItem("aquiles_auth") ? "✅" : "❌",
    aquiles_token: localStorage.getItem("aquiles_token") ? "✅" : "❌",
    aquiles_auth_timestamp: localStorage.getItem("aquiles_auth_timestamp") ? "✅" : "❌",
  });

  // sessionStorage
  console.log("📦 sessionStorage items:", {
    aquiles_auth: sessionStorage.getItem("aquiles_auth") ? "✅" : "❌",
  });

  // Token válido
  console.log("✓ Token válido:", isTokenValid());

  // Token en storage
  const token = getTokenFromStorage();
  if (token) {
    console.log("🔑 Token:", token.substring(0, 50) + "...");
    console.log("🔑 Largo:", token.length);
  }

  // Antigüedad
  const age = getTokenAge();
  if (age !== null) {
    console.log("⏱️ Antigüedad:", `${age}ms (${Math.round(age / 1000)}s)`);
  }

  console.log("🔍 [TokenPersistence] ═══════════════════════════════════════");
};
