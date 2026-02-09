declare namespace Express {
  interface Request {
    user?: AuthenticatedUser;
    organizationId?: string;
    dbConnection?: DataSource;
  }
}
