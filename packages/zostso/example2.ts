/* Demonstrate starting, pinging, and stopping a TSO address space */

import { ISession, Logger, LoggingConfigurer, Session } from "@zowe/imperative";
import { PingTso, StartTso, StopTso } from "./";

Logger.initLogger(LoggingConfigurer.configureLogger("lib", {name: "test"}));

const sessCfg: ISession = {
    hostname: "example.com",
    port: 443,
    rejectUnauthorized: false,
    user: "ibmuser",
    password: "password",
    type: "basic"
};
const session = new Session(sessCfg);
const accountNumber = "ACCT#";

(async () => {
    const startResponse = await StartTso.start(session, accountNumber, {
        codePage: "285"
    });
    const servletKey = startResponse.servletKey;
    if (startResponse.success) {
        console.log(`[${servletKey}] Started`);
    } else {
        throw new Error("Failed to start TSO address space");
    }

    const pingResponse = await PingTso.ping(session, servletKey);
    if (pingResponse.success) {
        console.log(`[${servletKey}] Ping succeeded`);
    } else {
        throw new Error("Failed to ping TSO address space");
    }

    const stopResponse = await StopTso.stop(session, servletKey);
    if (stopResponse.success) {
        console.log(`[${servletKey}] Stopped`);
    } else {
        throw new Error("Failed to stop TSO address space");
    }

    try {
        await PingTso.ping(session, servletKey);
    } catch {
        console.log(`[${servletKey}] Ping failed`);
    }
})().catch((err) => {
    console.error(err);
    process.exit(1);
});
