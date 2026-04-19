export class AppRoles {
  static Admin = "admin"
  static GeneralManager = "general_manager"
  static FohManager = "front_of_house_manager"
  static Host = "host"
  static Server = "server"
  static Expo = "expo"

  static ManagementRoles = [
    AppRoles.Admin,
    AppRoles.GeneralManager,
    AppRoles.FohManager,
  ]

  static TimeOffApproverRoles = [
    AppRoles.GeneralManager,
    AppRoles.FohManager,
    AppRoles.Admin,
  ]
}
