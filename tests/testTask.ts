import { taskRunner } from "@_koii/task-manager";

import "../src/index.js";
import { namespaceWrapper } from "@_koii/namespace-wrapper";

async function executeTasks() {
    let round = 1;
    await taskRunner.task(round);
    const submission = await namespaceWrapper.storeGet("value");
    console.log("Audit result:", submission === "Join the Attention Economy | Koii | Koii")
    process.exit(0);
}
executeTasks()