# DNS Configuration for TunisiaTrip.kr

## Critical SPF Configuration for Email Deliverability

### What is SPF?
SPF (Sender Policy Framework) is a DNS record that specifies which mail servers are authorized to send emails on behalf of your domain. This is **essential** for email deliverability and prevents your emails from being marked as spam.

### Current Issue
The website currently lacks a proper SPF record. The HTML meta tag on line 80 of index.html has **NO EFFECT** - SPF must be configured at the DNS level.

---

## Required DNS Records

### 1. SPF Record (CRITICAL - High Priority)

Add this as a **TXT record** in your DNS settings for `tunisiatrip.kr`:

```
Type: TXT
Host: @ (or tunisiatrip.kr)
Value: v=spf1 include:_spf.google.com include:sendgrid.net ~all
```

**Explanation:**
- `v=spf1` - SPF version 1 (required)
- `include:_spf.google.com` - If using Gmail/Google Workspace
- `include:sendgrid.net` - If using SendGrid for transactional emails
- `~all` - Soft fail (recommended for testing; use `-all` for strict enforcement once tested)

**If using other email services, adjust accordingly:**
- Mailgun: `include:mailgun.org`
- Amazon SES: `include:amazonses.com`
- Microsoft 365: `include:spf.protection.outlook.com`

### 2. DKIM Record (Recommended)

DKIM (DomainKeys Identified Mail) adds a digital signature to your emails.

**Setup depends on your email provider:**
- For Google Workspace: Follow [Google's DKIM setup guide](https://support.google.com/a/answer/174124)
- For SendGrid: Generate DKIM records in SendGrid dashboard under Settings → Sender Authentication

Typically looks like:
```
Type: TXT
Host: [selector]._domainkey.tunisiatrip.kr
Value: [provided by email service]
```

### 3. DMARC Record (Recommended)

DMARC (Domain-based Message Authentication) tells receiving servers what to do with emails that fail SPF/DKIM checks.

```
Type: TXT
Host: _dmarc.tunisiatrip.kr
Value: v=DMARC1; p=none; rua=mailto:dmarc-reports@tunisiatrip.kr; pct=100
```

**After testing, increase policy strictness:**
```
v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@tunisiatrip.kr; pct=100
```

Or for maximum protection (after thorough testing):
```
v=DMARC1; p=reject; rua=mailto:dmarc-reports@tunisiatrip.kr; pct=100
```

---

## How to Configure DNS Records

### For Common DNS Providers:

#### Cloudflare
1. Log in to Cloudflare dashboard
2. Select your domain `tunisiatrip.kr`
3. Go to **DNS** → **Records**
4. Click **Add record**
5. Select **TXT** as type
6. Enter `@` for Name (root domain)
7. Paste the SPF value
8. Save

#### GoDaddy
1. Log in to GoDaddy account
2. Go to **My Products** → **DNS**
3. Click **Add** under Records
4. Select **TXT** as Type
5. Enter `@` for Host
6. Paste SPF value in TXT Value
7. Save

#### Namecheap
1. Log in to Namecheap account
2. Go to **Domain List** → select domain
3. Click **Advanced DNS**
4. Click **Add New Record**
5. Select **TXT Record**
6. Enter `@` for Host
7. Paste SPF value
8. Save

#### Route 53 (AWS)
1. Open Route 53 console
2. Select hosted zone `tunisiatrip.kr`
3. Click **Create Record**
4. Leave name blank (root domain)
5. Select **TXT** as Type
6. Paste SPF value
7. Create

---

## Verification Steps

### 1. Check SPF Record
After adding the DNS record, verify it using:

**Command line:**
```bash
nslookup -type=TXT tunisiatrip.kr
```

**Online tools:**
- [MXToolbox SPF Checker](https://mxtoolbox.com/spf.aspx)
- [Google Admin Toolbox](https://toolbox.googleapps.com/apps/checkmx/)
- [DMARC Analyzer](https://www.dmarcanalyzer.com/spf/checker/)

### 2. Test Email Deliverability
Send test emails to:
- [Mail Tester](https://www.mail-tester.com/) - Get a score out of 10
- Your own Gmail/Outlook account - Check if it lands in inbox or spam

### 3. Monitor DMARC Reports
Set up monitoring for the email address in your DMARC record (`dmarc-reports@tunisiatrip.kr`) to receive weekly reports about your email authentication.

---

## Common Issues

### Issue: Multiple SPF Records
**Problem:** Only one SPF record is allowed per domain
**Solution:** Combine all includes into a single SPF record

### Issue: SPF Record Too Long
**Problem:** SPF records have a 255-character limit and 10 DNS lookup limit
**Solution:** Use SPF flattening services or reduce includes

### Issue: Changes Not Propagating
**Problem:** DNS changes can take 24-48 hours to propagate globally
**Solution:** Wait for propagation, verify with multiple DNS checkers from different locations

---

## Timeline for Implementation

1. **Immediate (Day 1):**
   - Add SPF TXT record to DNS
   - Verify record propagation (2-48 hours)

2. **Week 1:**
   - Monitor email deliverability
   - Set up DKIM with email provider
   - Add DKIM records to DNS

3. **Week 2:**
   - Verify DKIM is working
   - Add DMARC record with `p=none` (monitoring only)
   - Monitor DMARC reports

4. **Month 2:**
   - Increase DMARC policy to `p=quarantine` if reports look good
   - Fix any failing authentication

5. **Month 3+:**
   - Consider `p=reject` for maximum protection
   - Continue monitoring reports

---

## Contact Your DNS Provider

If you're unsure about making these changes, contact your DNS provider's support with this document. They can assist with:
- Adding TXT records
- Configuring SPF, DKIM, and DMARC
- Verifying configuration
- Troubleshooting issues

---

## Resources

- [SPF Record Syntax](https://www.rfc-editor.org/rfc/rfc7208)
- [DMARC Guide](https://dmarc.org/overview/)
- [Google Workspace SPF Setup](https://support.google.com/a/answer/33786)
- [Microsoft 365 SPF Setup](https://docs.microsoft.com/en-us/microsoft-365/security/office-365-security/set-up-spf-in-office-365-to-help-prevent-spoofing)
