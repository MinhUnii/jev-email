import { choice, TypeSafeClient } from "@typesafe-ai/sdk"

const client = new TypeSafeClient()

export async function classifyEmail(subject: string, body: string){
    const response = await client.systemOne({
        state: {
            email: `
                Subject: ${subject}
                Body: ${body}`
        },
        questions: {
            category: choice(
                "What is the main category of this customer email?",
                {
                    billing:
                        "Payment, invoice, charge, refund, subscription billing, or incorrect payment.",

                    technical:
                        "Technical problem, login issue, bug, integration problem, or product malfunction.",

                    sales:
                        "Pricing inquiry, upgrade interest, purchase intent, enterprise plan, or sales opportunity.",

                    complaint:
                        "Customer dissatisfaction where the primary issue is poor service or negative experience.",

                    spam:
                        "Spam, scam, phishing, malicious, irrelevant advertising, or unsolicited content.",

                    other:
                        "The email does not clearly belong to any of the other categories.",
                }
            )
        }
    })
    return response.answers.category
}