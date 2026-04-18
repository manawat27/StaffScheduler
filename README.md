# Staff Scheduler

## TODOs

### TODO: Configure Production Email (SMTP) for User Invitations

Currently, user invitation emails are caught locally by **MailHog** (dev only). Before hosting this app in production, you need a real SMTP setup so that password-setup emails reach any recipient's inbox.

**Steps:**

1. **Get a custom domain** (e.g., `staffscheduler.com`) from a registrar like Namecheap, Cloudflare, or Route 53.

2. **Choose a transactional email provider** — pick one:
   - **SendGrid** (free tier: 100 emails/day)
   - **AWS SES** (cheapest at scale, ~$0.10 per 1,000 emails)
   - **Mailgun** (free tier: 1,000 emails/month)
   - **Postmark** (best deliverability, 100 emails/month free)

3. **Verify your domain with the email provider:**
   - Add the provider's DNS records (SPF, DKIM, DMARC) to your domain's DNS settings.
   - SPF: Authorizes the provider to send on your behalf.
   - DKIM: Cryptographically signs emails to prevent spoofing.
   - DMARC: Tells receiving servers how to handle unauthenticated emails.
   - Example for SendGrid: add a CNAME for `em1234.staffscheduler.com` and a TXT record for SPF.

4. **Get SMTP credentials from your provider:**
   - Host (e.g., `smtp.sendgrid.net`)
   - Port (typically `587` for STARTTLS or `465` for SSL)
   - Username (e.g., `apikey` for SendGrid)
   - Password / API key

5. **Update Keycloak SMTP configuration** in `keycloak-config/realm-export.json`:
   ```json
   "smtpServer": {
     "host": "<provider-smtp-host>",
     "port": "587",
     "from": "noreply@staffscheduler.com",
     "fromDisplayName": "Staff Scheduler",
     "ssl": "false",
     "starttls": "true",
     "auth": "true",
     "user": "<smtp-username>",
     "password": "<smtp-password>"
   }
   ```

6. **Use environment variables instead of hardcoding secrets** — the `keycloak-config/startup.sh` already has placeholder substitution for `KC_SMTP_SERVER_USER` and `KC_SMTP_SERVER_PASSWORD`. Pass these via your deployment environment (e.g., Docker secrets, Kubernetes secrets, or CI/CD env vars):
   ```yaml
   # docker-compose.prod.yml or deployment config
   environment:
     KC_SMTP_SERVER_USER: "<smtp-username>"
     KC_SMTP_SERVER_PASSWORD: "<smtp-password>"
   ```

7. **Move out of SES sandbox (if using AWS SES):**
   - By default, SES only allows sending to verified email addresses.
   - Request production access in the AWS console to send to any recipient.

8. **Test the full flow:**
   - Invite a user with a real email address from the Staff Management page.
   - Verify they receive the password-setup email.
   - Verify the email doesn't land in spam (check SPF/DKIM/DMARC alignment).

9. **Remove or disable MailHog** from the production `docker-compose.yml` — it should only run in development.
