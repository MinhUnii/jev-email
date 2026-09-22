import "dotenv/config";

import {
    choice, 
    TypeSafeClient
} from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const response = await client.systemOne({
    state: {
        email: `
            Subject: Login problem

I've reset my password three times,
but every time I sign in the site says
"invalid session".

Can somebody fix this?
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

const category = response.answers.category
console.log(category)
console.log("Choice: ", category.choice)
console.log("Confidence: ", category.confidence)
console.log("Probabilities: ", category.probabilities)

const AUTO_ROUTE_THRESHOLD = 0.9;
if(category.confidence >= AUTO_ROUTE_THRESHOLD){
    console.log("AUTO ROUTE ->", category.choice)
} else{
    console.log("HUMAN REVIEW")
}
