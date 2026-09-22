import { choice, TypeSafeClient } from "@typesafe-ai/sdk"

const client = new TypeSafeClient();

export interface TriageResult {
    errorType: string;
    action: string;
    confidence: number;
}

export async function triageTerminalError(errorOutput: string): Promise<TriageResult> {

    const response = await client.systemOne({
        state: {
            terminalOutput: errorOutput
        },
        questions: {
            errorType: choice(
                "What is the root cause of this execution error?",
            {
                library: "The error is caused by a missing or incompatible library dependency.",
                syntax_error: "TypeScript or JavaScript syntax error, unexpected token.",
                type_error: "TypeScript type mismatch or missing type definitions.",
                runtime_exception: "Unhandled error, null pointer, or business logic bug during execution.",
                other: "Network, file permission, or unknown system error."
            }),
            action: choice(
                "What is the best next action to resolve this error?",
            {
                run_npm_install: "Run 'npm install' to ensure all dependencies are installed.",
                call_coder_llm: "Invoke Coder Agent / LLM to rewrite or fix source code.",
                abort_and_notify: "Stop execution and escalate to developer."
            }
            )
        }
    });

    const errorType = response.answers.errorType;
    const action = response.answers.action;

    return{
        errorType: errorType.choice,
        action: action.choice,
        confidence: Math.min(errorType.confidence, action.confidence)
    }
}



console.log("")