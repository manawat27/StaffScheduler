import KeycloakService from "../auth/keycloakService"
import axios from "axios"
import config from "../config"

export const updateUserInfo = async (uuid: string, data: any) => {
  const token = await KeycloakService.getToken()
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
  try {
    await axios.patch(`${config.API_BASE_URL}/keycloak-user/${uuid}`, data, {
      headers,
    })
  } catch (error) {
    console.error("Error updating user info:", error)
  }
}
