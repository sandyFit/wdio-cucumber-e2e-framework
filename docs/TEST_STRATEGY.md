# Test Strategy — wdio-cucumber-e2e-framework

## 1. Purpose

This document defines the overall testing approach for the WebdriverIO BDD automation framework. It establishes the principles, methods, and standards that guide how quality is validated across both the UI and API layers of the application.

---

## 2. Scope

### In Scope
- UI functional testing of critical user flows
- API contract and workflow validation
- Cross-browser execution (Chrome, Firefox)
- CI/CD integration via Jenkins

### Out of Scope
- Performance and load testing *(planned for future iteration)*
- Safari browser testing *(macOS-only WebDriver constraint)*
- Security testing
- Mobile/native application testing

---

## 3. Test Objectives

- Validate that critical user flows function correctly end-to-end
- Detect regressions early in the development cycle
- Provide fast, reliable feedback through automation
- Maintain a suite that is easy to extend and maintain over time

---

## 4. Test Levels

### 4.1 UI Testing
Validates the application from the user's perspective using WebdriverIO and Cucumber.

- Implemented with the **Page Object Model** to separate selectors from test logic
- Written in **Gherkin** for readability across technical and non-technical stakeholders
- Executed in headless Chrome and Firefox for speed and CI compatibility

### 4.2 API Testing
Validates backend behavior independently of the UI layer.

- Implemented using a **Service Layer** abstraction
- Includes **schema validation** to verify response structure
- Uses **Mocha + Chai** for assertions
- Faster execution and earlier defect detection compared to UI tests

---

## 5. Test Types

| Type | Purpose | Tag | Approx. Duration |
|---|---|---|---|
| Smoke | Validate critical paths are functional | `@smoke` | ~5 min |
| Functional | Feature-level validation | `@ui` | ~15 min |
| Regression | Full suite execution | *(no tag filter)* | ~30 min |
| API | Backend workflow validation | *(separate suite)* | ~5 min |

---

## 6. Risk-Based Prioritization

Testing effort is concentrated on areas with the highest business impact and failure risk:

| Area | Risk Level | Rationale |
|---|---|---|
| Authentication | High | System entry point — failure blocks all other flows |
| Product search & detail | High | Core user engagement feature |
| API booking endpoints | High | Data integrity and backend reliability |
| UI language switching | Medium | Localization affects all users |
| Edge cases & negative paths | Low *(current)* | Limited coverage — planned for expansion |

---

## 7. Test Design Approach

### BDD with Gherkin
Tests are written in Given/When/Then format to ensure clarity and shared understanding between QA, development, and stakeholders.

```gherkin
Scenario: Successful login with valid credentials
  Given the user is on the login page
  When they enter valid credentials
  Then they should be redirected to the dashboard
```

### Typed Test Data
- Centralized data factories prevent duplication and invalid inputs
- TypeScript interfaces enforce structure on request/response objects
- Reduces runtime errors caused by malformed test data

### Test Independence
Each test is designed to run independently with no shared state between scenarios. This enables parallel execution and prevents cascading failures.

---

## 8. Execution Strategy

### Parallel Execution
```js
maxInstances: 2
maxInstancesPerCapability: 2
```
Reduces total suite runtime by running tests concurrently across browser instances.

### Tag-Based Filtering
Allows targeted execution depending on context:
```bash
npm run test:ui:smoke     # Pre-deployment validation
npm run test:ui:auth      # Authentication focus
npm run test:ui:products  # Product feature focus
```

### Retry Mechanism
```js
specFileRetries: 2
```
Applied as a short-term mitigation for environment-related flakiness. Root cause analysis is prioritized over relying on retries as a permanent fix.

---

## 9. Stability Practices

| Practice | Rationale |
|---|---|
| Explicit/implicit waits | Eliminates timing-related failures |
| Stable, semantic selectors | Reduces breakage from UI changes |
| No hard-coded delays | Improves speed and reliability |
| Test isolation | Prevents inter-test dependencies |
| Retries as fallback only | Masks real failures if overused |
| Manual flow verification before automation | Catches auto-fill and field ordering dependencies invisible to automation |
| Browser-aware timeouts | Accounts for Firefox headless loading slower than Chrome |

---

## 10. Test Environment

| Component | Detail |
|---|---|
| Browsers | Chrome (Headless), Firefox (Headless) |
| Execution | Local and CI (Jenkins) |
| OS | Cross-platform (Node.js based) |
| Test data | Managed via centralized factories |
| Browser language | Forced to English (`--lang=en-US`) to ensure consistent assertions across locales |

---

## 11. Entry and Exit Criteria

### Entry Criteria
- Feature branch is merged and build is passing
- Test environment is available and stable
- Test data is seeded or accessible

### Exit Criteria
- All smoke tests passing
- No critical or high severity defects open
- Test execution report generated and reviewed

---

## 12. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Automation Engineer | Framework design, test implementation, maintenance |
| Developer | Providing stable selectors, supporting test environment |
| CI/CD | Automated execution on build triggers |

---

## 13. Tools Summary

| Purpose | Tool |
|---|---|
| Test framework | WebdriverIO |
| BDD layer | Cucumber (Gherkin) |
| Language | TypeScript |
| Assertions | Chai |
| UI reporting | Allure |
| API reporting | Mochawesome |
| CI/CD | Jenkins |

---

## 14. Application Change Management

The application under test is a third-party public environment that can change without notice. During this project, several unannounced changes were detected and addressed:

- **Post-signup redirect changed** — the application updated the registration flow to redirect to `/account` instead of `/auth/login`
- **New required form field added** — a `house_number` field was introduced to the signup form, breaking test data factories and page objects
- **Form auto-fill behavior introduced** — country and postal code selection now automatically populates street, city and state, requiring a specific field fill order
- **Toast message text changed** — the cart success notification text changed, breaking hardcoded XPath selectors

These incidents reinforce the importance of **frequent smoke test execution** as the primary mechanism for detecting application changes early. Full defect details are documented in the [Test Plan](TEST_PLAN.md).

---

## 15. Known Limitations and Planned Improvements

### Current Limitations
- Negative and edge case coverage is limited
- Retry mechanism treats symptoms rather than root causes in some cases
- No automated alerting when third-party application changes are detected

### Planned Improvements
- Expand negative test scenarios across all functional areas
- Add screenshot and log capture on failure for faster debugging
- Improve test data isolation between parallel runs
- Introduce performance testing layer
- Add smoke test scheduled runs to detect application changes proactively

---

*Document version: 1.1 | Framework: wdio-cucumber-e2e-framework*
