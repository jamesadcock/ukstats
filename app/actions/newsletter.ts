"use server";

export interface NewsletterState {
  status: "idle" | "success" | "error";
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeToNewsletter(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = formData.get("email");

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const apiUrl = process.env.NEWSLETTER_API_URL;
  if (!apiUrl) {
    console.error("[ukstats] NEWSLETTER_API_URL is not configured.");
    return {
      status: "error",
      message: "Subscription service is unavailable. Please try again later.",
    };
  }

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      console.error(
        `[ukstats] Newsletter API responded with ${res.status} for ${email}`,
      );
      return {
        status: "error",
        message: "Something went wrong. Please try again later.",
      };
    }

    return { status: "success" };
  } catch (err) {
    console.error("[ukstats] Newsletter API fetch failed:", err);
    return {
      status: "error",
      message: "Something went wrong. Please try again later.",
    };
  }
}
