# 🔖 Semantic Versioning & Conventional Commits Specification

This document defines the versioning strategy, Git commit conventions, and branch lifecycle management for the **UCE Web Programming Monorepo**.

---

## 1. Semantic Versioning Specification (SemVer 2.0.0)

This repository adheres strictly to [Semantic Versioning 2.0.0](https://semver.org/). Version numbers follow the syntax:

$$\textbf{MAJOR}.\textbf{MINOR}.\textbf{PATCH}$$

- **MAJOR** version (`X.0.0`): Incremented when incompatible API changes, major architectural redesigns, or breaking changes are introduced.
- **MINOR** version (`0.X.0`): Incremented when new functionality is added in a backward-compatible manner (e.g., new endpoints, new portal pages, non-breaking features).
- **PATCH** version (`0.0.X`): Incremented when backward-compatible bug fixes, performance patches, or cosmetic adjustments are committed.

Pre-release tags may append a hyphen and identifiers (e.g., `1.0.0-rc.1`, `1.0.0-beta.2`).

---

## 2. Conventional Commits 1.0.0 Specification

Commit messages must adhere to the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification to facilitate automated changelog generation and SemVer increments.

### Commit Format Structure

```
<type>(<scope>): <subject> [WEB-<issue-id>]

[optional body describing the motivation, implementation details, and impact]

[optional footer(s): BREAKING CHANGE: <explanation>, Closes #123, etc.]
```

### Commit Types

| Type | Description | SemVer Impact |
| :--- | :--- | :--- |
| `feat` | Introduces a new feature or user-facing capability | **MINOR** |
| `fix` | Resolves a software defect, bug, or incorrect behavior | **PATCH** |
| `perf` | Code adjustment improving compute speed, payload size, or memory | **PATCH** |
| `refactor` | Code restructuring without fixing a bug or adding a feature | **PATCH** / None |
| `docs` | Documentation updates, README additions, Javadoc enhancements | None |
| `style` | Formatting, whitespace, linting rules without logic changes | None |
| `test` | Adding missing tests, updating unit/e2e regression suites | None |
| `chore` | Dependency bumps, build tool configurations, monorepo metadata | None / **PATCH** |
| `ci` | Changes to CI/CD workflows, automation scripts, Docker/AWS deployment | None |

### Recognized Scopes

Scopes isolate changes to individual packages or cross-cutting subsystems:

- `backend`: Java Spring Boot REST controllers, models, and repositories.
- `frontend`: Student Academic Management web client (`frontend/`).
- `rick-morty`: Rick and Morty exploration portal (`miniproyecto_rick_morty/`).
- `monorepo`: Root workspace, dependencies, and Turborepo configuration.
- `gateway`: Nginx reverse proxy, routing, load balancing, or security headers.
- `docker`: Dockerfile definitions, `docker-compose.yml`, or container networking.

### Breaking Changes

Any commit that breaks backward compatibility must indicate this with an exclamation mark (`!`) before the colon or include a `BREAKING CHANGE:` footer. A breaking change triggers an immediate **MAJOR** version bump.

```
feat(gateway)!: migrate legacy /api/ endpoints to mandatory /api/v1 prefix (WEB-32)

BREAKING CHANGE: The unversioned /api/ endpoints are replaced with /api/v1/. All API consumers must update their base URLs.
```

---

## 3. Git Workflow & Branching Strategy

Our development follows a GitFlow-inspired branching strategy:

1. **`main`**: Production-ready branch. Only tagged releases and tested hotfixes are merged here.
2. **`develop`**: Integration branch for ongoing sprint deliverables. All feature branches branch off and merge into `develop`.
3. **Feature Branches**:
   - Syntax: `feature/<ISSUE-KEY>-<kebab-case-description>`
   - Example: `feature/WEB-30-semver-conventional-commits`
4. **Bugfix Branches**:
   - Syntax: `fix/<ISSUE-KEY>-<description>`
   - Example: `fix/WEB-16-throttle-syntax-error`

---

## 4. Release Lifecycle & Tagging Baseline

Releases are marked with Git annotated tags following the format:

```bash
git tag -a v1.0.0 -m "Release v1.0.0: Initial academic monorepo baseline"
git push origin v1.0.0
```

Release verification checklist:
1. All Turborepo pipelines (`npm run build`, `npm run test`, `npm run lint`) pass with zero errors.
2. Container build verification passes (`docker-compose build`).
3. Jira issue states are transitioned to **Finalizado**.
