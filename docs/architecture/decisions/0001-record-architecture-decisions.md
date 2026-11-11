# 0001: Record architecture decisions

- **Status:** accepted
- **Date:** 2026-11-11

## Context
Agents and humans both work on this codebase. Decisions need to be discoverable so they aren't re-litigated or silently violated.

## Decision
Record significant technical decisions as short ADRs in `docs/architecture/decisions/`, numbered sequentially and based on `0000-adr-template.md`. An ADR is never edited after it's accepted. Write a new one that supersedes it.

## Consequences
Agents must check existing ADRs before proposing architectural changes (the `/plan-issue` skill does this).
