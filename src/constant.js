export const BACKEND_GOOGLE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/google`;

export const BACKEND_GOOGLE_GMAIL_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/gmail`;

export const ProductName = "Syntx AI";

export const Version = "0.2.0";

export const supportEmail = "support.agent@syntx.in";

export const grievanceEmail = "grievance.agent@syntx.in";

export const subscriptionChangeEmailTemplateSubject = "Request for Subscription Plan Change - Syntx AI Account";

export const googleDeveloperAPI_UserDataPolicy = "https://developers.google.com/terms/api-services-user-data-policy";

export const subscriptionChangeEmailTemplateBody = ({ email, currentPlan ,name}) => `
Hi Syntx Support Team,

I am writing to request a change to the subscription plan for my account associated with this email address (${email}).

Currently, I am on the ${currentPlan} plan. I would like to [Upgrade to / Downgrade to / Cancel and move to] the [New Plan Name / Free Plan].

Could you please process this change and let me know if there are any prorated charges, refunds, or further steps I need to take on my end?

Here are my account details for reference:

Account Email: ${email}
Current Plan: ${currentPlan}

Thank you for your assistance.

Best regards,  
${name}
`;