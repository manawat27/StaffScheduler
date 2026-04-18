import keycloak from "./keycloak"

const initializeKeycloak = (onAuthenticatedCallback: () => void) => {
  keycloak
    .init({
      onLoad: "login-required",
      checkLoginIframe: false,
      enableLogging: true,
    })
    .then((authenticated) => {
      if (authenticated) {
        setInterval(() => {
          keycloak
            .updateToken(60)
            .then((refreshed) => {
              if (refreshed) {
                console.log("Token refreshed")
              } else {
                console.log("Token still valid")
              }
            })
            .catch(() => {
              console.warn("Token refresh failed — logging out")
              keycloak.logout()
            })
        }, 60_000)

        onAuthenticatedCallback()
      } else {
        console.warn("User not authenticated")
      }
    })
    .catch((err) => {
      console.error("Keycloak init failed:", err)
    })
}

const isAuthenticated = (): boolean => {
  return !!keycloak.authenticated
}

const getUserInfo = (): {
  uuid?: string
  firstName: string
  lastName: string
  email: string
  userName: string
  phone: string | null
  dateOfBirth: string | null
  country: string | null
  city: string | null
  postalCode: string | null
  organization: string | null
  roles: string[]
  enabled: boolean
} | null => {
  if (keycloak.authenticated && keycloak.tokenParsed) {
    return {
      uuid: keycloak.tokenParsed.sub ?? undefined,
      firstName: keycloak.tokenParsed.given_name,
      lastName: keycloak.tokenParsed.family_name,
      email: keycloak.tokenParsed.email,
      userName: keycloak.tokenParsed.preferred_username,
      phone: keycloak.tokenParsed.phone ?? null,
      dateOfBirth: keycloak.tokenParsed.dateOfBirth ?? null,
      country: keycloak.tokenParsed.country ?? null,
      city: keycloak.tokenParsed.city ?? null,
      postalCode: keycloak.tokenParsed.postalCode ?? null,
      organization: keycloak.tokenParsed.organization ?? null,
      roles: (keycloak.tokenParsed.realm_access?.roles || []).filter(
        (r: string) =>
          ![
            "default-roles-staff-scheduler",
            "offline_access",
            "uma_authorization",
          ].includes(r),
      ),
      enabled: keycloak.tokenParsed.enabled ?? true,
    }
  }
  return null
}

const getToken = (): string | undefined => {
  return keycloak.token
}

const kcLogout = (): void => {
  keycloak.logout()
}

const getUserId = (): string | null => {
  if (keycloak.authenticated && keycloak.tokenParsed) {
    return keycloak.tokenParsed.sub ?? null
  }
  return null
}

const getUserRoles = (): string[] => {
  return keycloak.tokenParsed?.realm_access?.roles || []
}

const getOrganizationFromToken = (): string | null => {
  if (keycloak.authenticated && keycloak.tokenParsed) {
    return keycloak.tokenParsed.organization || null
  }
  return null
}

const refreshToken = (): Promise<boolean> => {
  return keycloak.updateToken(-1) // Force token refresh by passing -1
}

const KeycloakService = {
  initializeKeycloak,
  isAuthenticated,
  getUserInfo,
  getToken,
  kcLogout,
  getUserId,
  getUserRoles,
  getOrganizationFromToken,
  refreshToken,
}

export default KeycloakService
