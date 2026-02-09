FROM keycloak/keycloak:26.2.3

# Copy the realm export file and keycloak configuration
COPY realm-export.json /opt/keycloak/data/import/realm-export.json
COPY keycloak.conf /opt/keycloak/conf/keycloak.conf

# Copy the custom theme
COPY themes/ /opt/keycloak/themes/

## Add a startup script to replace placeholders
# Need root to place script into bin and adjust perms
USER root
COPY startup.sh /opt/keycloak/bin/startup.sh
RUN sed -i 's/\r$//' /opt/keycloak/bin/startup.sh && chown 1000:0 /opt/keycloak/bin/startup.sh && chmod 755 /opt/keycloak/bin/startup.sh
# Ensure keycloak user can write to import directory for sed operations
RUN chown -R 1000:0 /opt/keycloak/data/import && chmod -R 755 /opt/keycloak/data/import
# Also ensure keycloak.conf is writable for DB config injection
RUN chown 1000:0 /opt/keycloak/conf/keycloak.conf && chmod 644 /opt/keycloak/conf/keycloak.conf
USER 1000

# Set the entrypoint to run the script first, then Keycloak
ENTRYPOINT ["/opt/keycloak/bin/startup.sh"]
CMD ["start", "--import-realm", "--config-file=/opt/keycloak/conf/keycloak.conf"]
