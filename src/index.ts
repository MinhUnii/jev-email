import "dotenv/config";

import {
    choice, 
    TypeSafeClient
} from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const response = await client.systemOne({
    state: {
        email: `
            Subject: Duplicate charge

            Hi,

            I was charged twice for my subscription this month.
            Can you please refund the duplicate charge?

            Thanks.
        `
    },
    questions:{
        category: choice(
            "What is the main category of this customer email?",
            {
                billing: "Payment, invoice, charge, refund, or subscription billing issue.",
                technical: "Technical problem, bug, login problem, integration issue, or product malfunction.",
                sales: "Pricing inquiry, purchase interest, upgrade, enterprise plan, or sales opportunity.",
                complaint: "Customer dissatisfaction or complaint where the primary issue is poor experience or service.",
                spam: "Spam, scam, irrelevant advertisement, malicious, or unsolicited content.",
                other: "None of the other categories clearly apply.",
            }
        ),
    },
});

console.log(response.answers.category)