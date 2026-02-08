#!/bin/bash

# Path to the realm file
REALM_FILE="/opt/keycloak/data/import/realm-export.json"
KEYCLOAK_CONF="/opt/keycloak/conf/keycloak.conf"

# Safeguard: ensure file exists and is writable
if [ -f "$REALM_FILE" ] && [ -w "$REALM_FILE" ]; then
  echo "[startup] Replacing AWS placeholders in realm file" >&2
  sed -i "s/KC_SMTP_SERVER_USER/$KC_SMTP_SERVER_USER/g" "$REALM_FILE"
  sed -i "s/KC_SMTP_SERVER_PASSWORD/$KC_SMTP_SERVER_PASSWORD/g" "$REALM_FILE"
  sed -i "s/KC_SSL_REQUIRED/$KC_SSL_REQUIRED/g" "$REALM_FILE"
  echo "[startup] Placeholder replacement completed" >&2
else
  echo "[startup] WARNING: Cannot modify realm file - file missing or not writable" >&2
  echo "[startup] REALM_FILE: $REALM_FILE" >&2
  echo "[startup] File exists: $([ -f "$REALM_FILE" ] && echo 'yes' || echo 'no')" >&2
  echo "[startup] File writable: $([ -w "$REALM_FILE" ] && echo 'yes' || echo 'no')" >&2
fi

# Append / update DB configuration dynamically if env vars provided
# NOTE: Keycloak 17+ uses KC_DB* env vars directly - no need to inject into config file
echo "[startup] DB configuration handled via KC_DB* environment variables" >&2
echo "[startup] KC_DB: ${KC_DB:-'NOT SET'}" >&2
echo "[startup] KC_DB_URL: ${KC_DB_URL:-'NOT SET'}" >&2
echo "[startup] KC_DB_USERNAME: ${KC_DB_USERNAME:-'NOT SET'}" >&2
echo "[startup] KC_SSL_REQUIRED: ${KC_SSL_REQUIRED:-'NOT SET'}" >&2

echo "[startup] Starting Keycloak with args: $*" >&2
echo "[startup] KC_IMPORT_REALM: ${KC_IMPORT_REALM:-'NOT SET'}" >&2

# Start Keycloak (pass all args to the original entrypoint)
exec /opt/keycloak/bin/kc.sh "$@"