# EmailJS Setup Instructions

This guide will help you set up EmailJS for the contact form to send real emails.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service

1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, Yahoo, etc.)
4. Follow the setup instructions for your provider
5. Note down the **Service ID** (e.g., `service_1234567`)

## Step 3: Create Email Template

1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Use this template structure:

```html
Subject: New Contact Form Submission - {{subject}}

From: {{from_name}} <{{from_email}}>
Phone: {{phone}}
Subject: {{subject}}

Message:
{{message}}

---
Newsletter Subscription: {{newsletter}}
Submitted: {{timestamp}}
Page: {{page_url}}
User Agent: {{user_agent}}
```

4. Save the template and note the **Template ID** (e.g., `template_1234567`)

## Step 4: Get Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** (e.g., `user_1234567890abcdef`)

## Step 5: Update Configuration

Open `js/contact.js` and update the `EMAILJS_CONFIG` object:

```javascript
const EMAILJS_CONFIG = {
    serviceID: 'service_1234567',     // Your Service ID
    templateID: 'template_1234567',   // Your Template ID
    publicKey: 'user_1234567890abcdef' // Your Public Key
};
```

## Step 6: Test the Form

1. Open your website
2. Fill out the contact form
3. Submit the form
4. Check your email inbox for the message

## Template Variables Reference

The following variables are sent to your EmailJS template:

- `{{from_name}}` - Full name (firstName + lastName)
- `{{from_email}}` - Email address
- `{{phone}}` - Phone number (or "Not provided")
- `{{subject}}` - Selected subject
- `{{message}}` - Message content
- `{{newsletter}}` - Newsletter subscription (Yes/No)
- `{{timestamp}}` - Submission date and time
- `{{page_url}}` - URL where form was submitted
- `{{user_agent}}` - Browser information

## Troubleshooting

### Common Issues:

1. **EmailJS not loading**: Check your internet connection and ensure the CDN link is correct
2. **Configuration errors**: Verify your Service ID, Template ID, and Public Key
3. **Email not received**: Check spam folder and verify email service setup
4. **Rate limiting**: EmailJS free plan has limits (200 emails/month)

### Fallback Behavior:

If EmailJS fails or isn't configured, the form will:
- Still validate and show success message
- Store submission data in browser localStorage
- Log the submission to browser console
- Allow you to implement alternative sending methods

## Security Notes

- Never expose your Private Key in client-side code
- Use EmailJS templates to prevent email injection
- Consider implementing server-side validation for production
- Monitor your EmailJS usage to avoid hitting limits

## Production Considerations

For production websites, consider:
- Upgrading to EmailJS paid plan for higher limits
- Implementing server-side email sending as backup
- Adding CAPTCHA to prevent spam
- Setting up email notifications for form submissions

## Support

- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Support: [https://www.emailjs.com/support/](https://www.emailjs.com/support/)

---

**Note**: The contact form will work even without EmailJS configuration, using a fallback method that stores submissions locally for testing purposes.
