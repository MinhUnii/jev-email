import "dotenv/config";

import { emails } from "./email";
import { classifyEmail } from "./router";
import { decideRouting } from "./policy";

for (const email of emails) {
    const result = await classifyEmail(email.subject, email.body);
    const routing = await decideRouting(result.choice, result.confidence);
    
    console.log("===============================");
    console.log("Email ID:", email.id);
    console.log("Subject:", email.subject);
    console.log("Body:", email.body);
    console.log("Expected: ", email.expected);

    console.log("Jev choice: ", result.choice);
    console.log("Jev confidence: ", result.confidence);
    console.log("Action: ", routing.action);
    console.log("Destination: ", routing.destination);
    console.log("===============================\n");
}
