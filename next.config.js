/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/** @type {(phase: string) => import("next").NextConfig} */
export default function config(phase) {
	return {
		distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
	};
}
