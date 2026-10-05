# Temporary security overrides

Review or remove these overrides by 2027-01-03. This date is 90 days after approval on 2026-10-05.

## `tools/danger`: `braces`

- Security advisory [vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), affecting published `braces` releases through 3.0.3. The advisory has no patched npm version as of 2026-10-05.
- Exposure: the PR review workflow moves `tools/danger/*` to the repository root and runs `npm install`; the vulnerable transitive dependency comes through the Danger toolchain (`micromatch`).
- Temporary mitigation: pin npm's package override to upstream `micromatch/braces` commit `28d440b5dd449dbf1fe6f3506cf94ecca4d02660` from [upstream PR #72](https://github.com/micromatch/braces/pull/72). The PR adds bounded recursion depth and cycle protection across parser, compile, expand, and stringify paths.
- Evidence: upstream test suite passed locally with 904 tests on 2026-10-05. The PR is not yet a published release, so this pin must be replaced with a fixed npm release once available.
- Review owner: repository maintainers. Recheck upstream PR/release status and the resolved npm tree by 2027-01-03; remove the override when a patched release is available.
