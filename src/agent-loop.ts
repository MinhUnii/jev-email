import "dotenv/config";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { triageTerminalError } from "./triage.js";

const execAsync = promisify(exec);

// Script mục tiêu muốn chạy thử
const TARGET_COMMAND = "npx tsx src/test-target.ts";

async function runCommand(cmd: string): Promise<{ stdout: string; stderr: string; error?: any }> {
  try {
    const { stdout, stderr } = await execAsync(cmd);
    return { stdout, stderr };
  } catch (err: any) {
    return {
      stdout: err.stdout || "",
      stderr: err.stderr || err.message,
      error: err,
    };
  }
}

async function startAgentLoop() {
  console.log(`\n🚀 [Agent] Đang chạy target: "${TARGET_COMMAND}"...`);
  const run1 = await runCommand(TARGET_COMMAND);

  if (!run1.error) {
    console.log("✅ Code chạy thành công, không phát hiện lỗi!");
    console.log(run1.stdout);
    return;
  }

  console.log("❌ Phát hiện lỗi thực thi. Log terminal:\n---");
  console.log(run1.stderr.slice(0, 400) + (run1.stderr.length > 400 ? "\n..." : ""));
  console.log("---\n🔍 Đang gửi terminal output sang Jev (System 1) để triage...");

  const triage = await triageTerminalError(run1.stderr);

  console.log(`\n📊 [Jev Decision]`);
  console.log(`- Nguyên nhân: ${triage.errorType}`);
  console.log(`- Hành động đề xuất: ${triage.action}`);
  console.log(`- Confidence: ${triage.confidence}`);

  // Policy: Nếu Jev tự tin trên 85% rằng đây là lỗi thiếu dependency -> tự chạy npm install
  if (triage.action === "run_npm_install" && triage.confidence >= 0.85) {
    console.log("\n⚡ [Policy: Auto-fix] Quyết định: Tự động chạy `npm install`...");
    await execAsync("npm install");
    console.log("📦 Cài đặt hoàn tất. Đang thử chạy lại lệnh target...");

    const run2 = await runCommand(TARGET_COMMAND);
    if (!run2.error) {
      console.log("🎉 Sửa lỗi thành công! Target đã chạy bình thường mà không cần gọi LLM.");
      console.log(run2.stdout);
    } else {
      console.log("⚠️ Vẫn còn lỗi, lúc này mới cần đánh thức LLM (System 2) sửa code.");
    }
  } else if (triage.action === "call_coder_llm") {
    console.log("🤖 [Policy] Chuyển tiếp log lỗi sang Coder LLM (GPT/Claude) để sinh lại code.");
  } else {
    console.log("🛑 [Policy] Lỗi không xác định hoặc confidence thấp, dừng lại báo developer.");
  }
}

startAgentLoop();