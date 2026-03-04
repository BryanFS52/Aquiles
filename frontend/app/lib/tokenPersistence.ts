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
 * Guardar token SOLO en sessionStorage y cookies (NO localStorage por seguridad)
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

    // Guardar en sessionStorage
    sessionStorage.setItem("aquiles_auth", JSON.stringify(authData));
    sessionStorage.setItem("aquiles_token", token);
    sessionStorage.setItem("aquiles_auth_timestamp", Date.now().toString());

    // Guardar en cookies de Aquiles
    const cookieValue = btoa(JSON.stringify(authData));
    document.cookie = `aquiles_session=${cookieValue}; path=/; max-age=86400; SameSite=Lax`;

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
 * Obtener token desde cookies de Aquiles
 */
const getTokenFromCookies = (): string | null => {
  try {
    const cookieMatch = document.cookie.match(/aquiles_session=([^;]+)/);
    if (cookieMatch && cookieMatch[1]) {
      const decoded = atob(cookieMatch[1]);
      const authData = JSON.parse(decoded);
      if (authData.token) {
        console.log("✅ [TokenPersistence] Token obtenido de cookies Aquiles");
        return authData.token;
      }
    }
  } catch (error) {
    console.error("❌ [TokenPersistence] Error leyendo cookies:", error);
  }
  return null;
};

/**
 * Obtener token de sessionStorage > cookies (NO localStorage por seguridad)
 */
export const getTokenFromStorage = (): string | null => {
  try {
    // PRIORIDAD 1: sessionStorage
    const sessionAuth = sessionStorage.getItem("aquiles_auth");
    if (sessionAuth) {
      const parsed = JSON.parse(sessionAuth);
      if (parsed.token) {
        console.log("✅ [TokenPersistence] Token obtenido de sessionStorage");
        return parsed.token;
      }
    }

    const sessionToken = sessionStorage.getItem("aquiles_token");
    if (sessionToken) {
      console.log("✅ [TokenPersistence] Token obtenido de sessionStorage (token string)");
      return sessionToken;
    }

    // PRIORIDAD 2: Cookies de Aquiles
    const cookieToken = getTokenFromCookies();
    if (cookieToken) {
      // Si encontramos token en cookies, sincronizar a sessionStorage
      sessionStorage.setItem("aquiles_token", cookieToken);
      return cookieToken;
    }

    console.warn("⚠️ [TokenPersistence] No hay token en sessionStorage ni cookies");
    return null;
  } catch (error) {
    console.error("❌ [TokenPersistence] Error obteniendo token:", error);
    return null;
  }
};

/**
 * Verificar que el token está en sessionStorage o cookies (NO localStorage)
 */
export const verifyTokenInStorage = (): boolean => {
  try {
    const token = getTokenFromStorage();
    const hasSessionAuth = !!sessionStorage.getItem("aquiles_auth");
    const hasSessionToken = !!sessionStorage.getItem("aquiles_token");
    const hasCookie = !!document.cookie.match(/aquiles_session=([^;]+)/);

    const isValid = token !== null && (hasSessionAuth || hasSessionToken || hasCookie);

    console.log("🔍 [TokenPersistence] Verificación de storage:", {
      tokenExists: !!token,
      sessionStorage: hasSessionAuth || hasSessionToken,
      cookies: hasCookie,
      valid: isValid,
      timestamp: sessionStorage.getItem("aquiles_auth_timestamp"),
    });

    return isValid;
  } catch (error) {
    console.error("❌ [TokenPersistence] Error verificando token:", error);
    return false;
  }
};

/**
 * Limpiar token de sessionStorage y cookies (NO localStorage)
 */
export const clearTokenFromStorage = (): void => {
  try {
    console.log("🗑️ [TokenPersistence] Limpiando tokens de sessionStorage y cookies...");
    
    // Limpiar sessionStorage
    sessionStorage.removeItem("aquiles_auth");
    sessionStorage.removeItem("aquiles_token");
    sessionStorage.removeItem("aquiles_auth_timestamp");
    
    // Limpiar cookies de Aquiles
    document.cookie = "aquiles_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    console.log("✅ [TokenPersistence] Tokens limpiados");
  } catch (error) {
    console.error("❌ [TokenPersistence] Error limpiando tokens:", error);
  }
};

/**
 * Obtener auth data completa desde sessionStorage > cookies (NO localStorage)
 */
export const getAuthDataFromStorage = (): AuthData | null => {
  try {
    // PRIORIDAD 1: sessionStorage
    const sessionAuth = sessionStorage.getItem("aquiles_auth");
    if (sessionAuth) {
      console.log("✅ [TokenPersistence] Auth data obtenida de sessionStorage");
      return JSON.parse(sessionAuth);
    }

    // PRIORIDAD 2: Cookies de Aquiles
    const cookieMatch = document.cookie.match(/aquiles_session=([^;]+)/);
    if (cookieMatch && cookieMatch[1]) {
      try {
        const decoded = atob(cookieMatch[1]);
        const authData = JSON.parse(decoded);
        console.log("✅ [TokenPersistence] Auth data obtenida de cookies Aquiles");
        // Sincronizar a sessionStorage
        sessionStorage.setItem("aquiles_auth", JSON.stringify(authData));
        return authData;
      } catch (e) {
        console.error("❌ [TokenPersistence] Error decodificando cookie:", e);
      }
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
 * Verificar edad del token (SOLO sessionStorage)
 */
export const getTokenAge = (): number | null => {
  try {
    const timestamp = sessionStorage.getItem("aquiles_auth_timestamp");
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
 * Debug: mostrar estado completo de storage (SOLO sessionStorage y cookies)
 */
export const debugStorageState = (): void => {
  console.log("🔍 [TokenPersistence] ═══════════════════════════════════════");
  console.log("🔍 [TokenPersistence] DEBUG - Estado de Storage");
  console.log("🔍 [TokenPersistence] ═══════════════════════════════════════");

  // sessionStorage
  console.log("📦 sessionStorage items:", {
    aquiles_auth: sessionStorage.getItem("aquiles_auth") ? "✅" : "❌",
    aquiles_token: sessionStorage.getItem("aquiles_token") ? "✅" : "❌",
    aquiles_auth_timestamp: sessionStorage.getItem("aquiles_auth_timestamp") ? "✅" : "❌",
  });

  // Cookies
  console.log("🍪 Cookies:", {
    aquiles_session: document.cookie.match(/aquiles_session=([^;]+)/) ? "✅" : "❌",
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
