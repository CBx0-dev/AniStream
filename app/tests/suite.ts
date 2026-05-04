export * from "@test/utils/harness";

if (APPLICATION_TARGET == "standalone") {
    await import("@test/utils/standalone");
} else {
    await import("@test/utils/client");
}

import "@test/utils/harness";