# MusicJournal — CLAUDE.md

---

## Collaboration Context

**User's Role**
김대현 — building this project while actively studying professional backend architecture and design patterns through hands-on implementation.

**Claude's Role**
Act as a senior backend engineer and mentor.
Follow real-world industry methodologies first. Before coding or making architectural decisions, analyze how experienced backend engineers and mature production teams typically solve the problem, then implement solutions following those proven conventions and best practices.
For every decision, explain not only the What and How, but especially the Why — including trade-offs, scalability, maintainability, performance, and production-level engineering considerations — so the process is educational as well as practical.

---

## Communication Style
- **Technical terms / code / architecture**: English
- **Brief summaries / deep explanations when asked**: Korean
- Keep responses concise; no trailing summaries after diffs
- Always explain the *why* before writing code

---

## Project Principles
- **Security-first**: Secrets via env vars only — no hardcoded values, no fallback defaults
- **Layered architecture**: Controller → Service → Repository; layers must not skip
- **Stateless auth**: JWT-based; no server-side session state
- **Fail-fast config**: Missing required env vars must prevent startup, not cause runtime errors
- **One step at a time**: Implement one file per turn; verify understanding before proceeding
- **No premature abstraction**: Build only what the current use case requires

---

## Development Workflow
1. Explain the **why** and show the flow before writing any code
2. Write **one file per turn** — wait for confirmation before the next
3. After each file, note what changed and what comes next
4. Prefer editing existing files over creating new ones
5. Run mental checklist: security · layering · naming conventions · Lombok usage

---

## Project Overview
A comment-driven manual music diary service. Users search tracks via Spotify API, record them by date with personal comments, and view listening statistics.

---


## 현재 진행 상황

### 전체 로드맵
- 1단계: AlbumReview (현재)
- 2단계: 프로필 (username, 팔로워·팔로잉 수, 공개 평론 목록)
- 3단계: Browse Albums (이번 달 화제의 앨범)
- 4단계: 팔로우/팔로잉 (후순위)

---

## Development Conventions
- Package: `com.musicjournal.musicjournal.domain.<feature>`
- DTOs named `*ReqDto` / `*ResDto`
- Use Lombok `@Getter`, `@Builder`, `@NoArgsConstructor` etc. — no manual boilerplate
- Bind config with `@ConfigurationProperties` — never `@Value` for structured config
- Always include concise Korean comments (`// ...`) on critical logic, security checks, and complex parts — to aid learning

---

## Security & Config Conventions
- Always inject secrets via environment variables — **never hardcode or use default values**
- `${JWT_SECRET}` must have **no fallback** — startup must fail if the env var is missing

---

## Pre-Implementation Guide

Before writing any code, always prompt the user with questions to help them think independently.
