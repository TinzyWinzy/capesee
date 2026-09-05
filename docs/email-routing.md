# Capesee Email — lazarus@capesee.com

## Option B: Cloudflare Email Routing (free, 5 min) → forwards to lazarus_chiweshe@yahoo.com

Capesee.com DNS is on Cloudflare (check Dash → capesee.com → Overview).

### Steps in Cloudflare Dash
1. Cloudflare → capesee.com → **Email** → **Email Routing** → **Get started**
2. Add destination `lazarus_chiweshe@yahoo.com` → verify via Yahoo link
3. **Create custom address**: `lazarus@capesee.com` → destination `lazarus_chiweshe@yahoo.com` → Create
4. Repeat for `info@capesee.com` and `hello@capesee.com` if wanted (all → Yahoo)
5. Cloudflare auto-adds `MX` `TXT` `SPF` records — click **Add records automatically** when prompted.
6. Test: send from Gmail to `lazarus@capesee.com` → arrives in Yahoo (check Spam first, mark Not Spam).

**Replies:** Free routing is forward-only. Replies will still show `lazarus_chiweshe@yahoo.com` unless you add Yahoo **Send As**:
- Yahoo Mail → Settings → Mailboxes → Add `lazarus@capesee.com` as Send-Only address → SMTP via Cloudflare (not needed for forward) — or move to Option C below for true `lazarus@capesee.com` sends.

### Option C: Full mailbox (replies from @capesee.com) — when ready
- **Zoho Mail Free** (5 users, no card) or **Google Workspace** ($7/user/mo)
- Zoho: sign up with capesee.com → verify domain via TXT → create `lazarus@capesee.com` mailbox → add Zoho MX (`mx.zoho.com`) in Cloudflare DNS (disable Email Routing first).
- Supports SPF/DKIM/DMARC for deliverability.

### What we did in code
- No code change needed — email is DNS only. `lazarus@capesee.com` will work for contact forms (`reply-to`) once routing is enabled.

### Verify
```
dig MX capesee.com
echo "test" | mail -s "capesee routing test" lazarus@capesee.com
```
