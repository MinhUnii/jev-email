export function decideRouting(choice: string, confidence: number) {
    if (confidence >= 0.9) {
        return {
            action: "AUTO-ROUTE",
            destination: choice
        }
    }
    return {
        action: "HUMAN-REVIEW",
        destination: "review"
    }
}