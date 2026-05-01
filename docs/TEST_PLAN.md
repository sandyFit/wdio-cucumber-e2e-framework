# Test Plan — wdio-cucumber-e2e-framework

**Project:** WebdriverIO BDD E2E Automation Framework
**Version:** 1.1
**Status:** Completed
**Last Updated:** April 2026

---

## 1. Introduction

### 1.1 Purpose
This test plan describes the scope, approach, resources, and schedule for the testing activities carried out as part of the WebdriverIO BDD automation framework project. It serves as the primary reference for what was tested, how, and with what outcomes.

### 1.2 Project Background
This framework was developed as part of a structured QA automation training program. The goal was to design and implement a production-grade test automation solution covering both UI and API layers of a sample web application, applying industry-standard practices including BDD, the Page Object Model, CI/CD integration, and structured reporting.

### 1.3 References
- [Test Strategy](TEST_STRATEGY.md)
- [WebdriverIO Documentation](https://webdriver.io/docs/gettingstarted)
- [Cucumber BDD Documentation](https://cucumber.io/docs/guides/)
- Restful Booker API: https://restful-booker.herokuapp.com/apidoc

---

## 2. Test Scope

### 2.1 Features Under Test

#### UI Layer
| Feature | Scenarios Covered |
|---|---|
| Authentication | Valid login, invalid credentials, session handling |
| Product Search | Search by keyword, empty results, filtering |
| Product Detail | Product information display, favorites |
| Language Switching | UI language toggle behavior |

#### API Layer
| Endpoint Area | Scenarios Covered |
|---|---|
| Authentication | Token generation, invalid credentials |
| Booking creation | Valid payload, required fields, response schema |
| Booking retrieval | Get by ID, list all bookings |
| Booking update | Full update (PUT), partial update (PATCH) |
| Booking deletion | Delete by ID, authorization required |

### 2.2 Out of Scope
- Performance and load testing
- Security and penetration testing
- Mobile browser testing
- Safari browser (macOS WebDriver constraint)
- Accessibility testing

---

## 3. Test Objectives

- Verify that all critical user flows function correctly across supported browsers
- Validate API endpoints against expected contracts and schemas
- Confirm the framework executes reliably in a CI/CD environment
- Demonstrate parallel execution, retry handling, and structured reporting

---

## 4. Test Approach

### 4.1 UI Testing
- BDD scenarios written in Gherkin, executed via WebdriverIO + Cucumber
- Page Object Model used to encapsulate all UI interactions
- Tests tagged for selective execution: `@smoke`, `@auth`, `@products`, `@ui`
- Executed in headless Chrome and Firefox

### 4.2 API Testing
- Independent from UI — no browser dependency
- Service layer abstracts HTTP calls from test logic
- Schema validation applied to all responses
- Mocha + Chai used for assertions

### 4.3 CI/CD Execution
- Jenkins pipelines configured for both UI and API test suites
- Scheduled and trigger-based builds supported
- Reports published automatically post-execution

---

## 5. Entry and Exit Criteria

### 5.1 Entry Criteria
- [ ] All feature branches merged into main
- [ ] Test environment accessible and stable
- [ ] Dependencies installed (`npm install`)
- [ ] Jenkins pipelines configured and validated

### 5.2 Exit Criteria
- [ ] All smoke tests passing in both browsers
- [ ] No open critical or high severity defects
- [ ] API test suite passing with schema validation confirmed
- [ ] Allure and Mochawesome reports generated successfully
- [ ] CI/CD pipeline executing without manual intervention

---

## 6. Test Deliverables

| Deliverable | Description | Status |
|---|---|---|
| Automated UI test suite | Gherkin features + step definitions + page objects | ✅ Complete |
| Automated API test suite | Service layer + schema validation + Mocha specs | ✅ Complete |
| Allure report | HTML report for UI test execution results | ✅ Complete |
| Mochawesome report | HTML report for API test execution results | ✅ Complete |
| Jenkins pipeline (UI) | Automated CI pipeline for UI test execution | ✅ Complete |
| Jenkins pipeline (API) | Automated CI pipeline for API test execution | ✅ Complete |
| Test Strategy | Testing philosophy, approach, and standards | ✅ Complete |
| Test Plan *(this document)* | Scope, objectives, and execution summary | ✅ Complete |

---

## 7. Test Environment

| Component | Detail |
|---|---|
| Application under test | Practice Software Testing (UI) + Restful Booker (API) |
| Browsers | Chrome (Headless), Firefox (Headless) |
| Node.js version | >= 18.x |
| Execution environment | Local + Jenkins CI |
| Operating system | Cross-platform |
| Test data strategy | Centralized typed factories |

---

## 8. Test Execution Summary

### 8.1 UI Tests

| Suite | Total Scenarios | Passed | Failed | Pass Rate |
|---|---|---|---|---|
| Smoke | — | — | — | — |
| Authentication | — | — | — | — |
| Products | — | — | — | — |
| Full Regression | — | — | — | — |

> Update this table with actual results from your final Allure report run.

### 8.2 API Tests

| Endpoint Group | Total Tests | Passed | Failed | Pass Rate |
|---|---|---|---|---|
| Authentication | — | — | — | — |
| Booking CRUD | — | — | — | — |
| Schema Validation | — | — | — | — |
| **Total** | — | — | — | — |

> Update this table with actual results from your final Mochawesome report run.

### 8.3 CI/CD Execution
- Jenkins UI pipeline: consecutive successful builds confirmed *(see `/docs/images/jenkins-pipeline.png`)*
- Jenkins API pipeline: consecutive successful builds confirmed *(see `/docs/images/jenkins-api-pipeline.png`)*

---

## 9. Defect Summary

| ID | Description | Severity | Root Cause | Status |
|---|---|---|---|---|
| BUG-001 | Signup flow failing — URL did not contain `/account` after registration | High | Application changed post-signup redirect from `/auth/login` to `/account`. Test assertion was not updated to reflect the new flow. | ✅ Fixed |
| BUG-002 | Cart success message not found — element with text `shopping cart` not displayed | Medium | Application toast message text changed. XPath selector was targeting hardcoded text that no longer matched the DOM. Selector updated to use `#toast-container` by ID. | ✅ Fixed |
| BUG-003 | Signup form incomplete — new required field `house_number` not populated | High | Application introduced a new required field without notice. Test data factory and page object did not include this field, causing silent form validation failure and blocking registration. | ✅ Fixed |
| BUG-004 | Signup form auto-fill conflict — street, city and state values overwritten | Medium | Application introduced address auto-fill behavior triggered by country and postal code selection. Filling address fields manually in the wrong order caused values to be overwritten or invalidated. Fill order corrected to: country → postal code → house number only. | ✅ Fixed |
| BUG-005 | Language test failing in Firefox — elements not loaded within timeout | Low | Firefox headless loads significantly slower than Chrome. The 10 second timeout was insufficient for product cards to render. Increased to 20 seconds for `waitForElementsCount` and 15 seconds for `waitForDisplayed`. | ✅ Fixed |

---

## 10. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Test environment instability | Medium | High | Retry mechanism (`specFileRetries: 2`) |
| Flaky selectors due to UI changes | Medium | Medium | Stable semantic selectors; POM isolates change impact |
| Third-party app changes without notice | High | High | Frequent smoke test runs to detect regressions early |
| Third-party API downtime | Low | High | API tests are independent; can mock if needed |
| Parallel execution conflicts | Low | Medium | Tests designed to be fully independent |
| Browser-specific timing differences | Medium | Medium | Browser-aware timeouts; longer waits configured for Firefox |

---

## 11. Assumptions and Dependencies

- The Practice Software Testing application remains publicly accessible during test execution
- Jenkins instance is available and configured with the correct Node.js version
- No authentication tokens are hardcoded — all generated dynamically at runtime
- Test data does not persist between runs
- Application UI and API contracts may change without notice — ongoing test maintenance is expected

---

## 12. Lessons Learned

- **BDD adds value early** — writing Gherkin scenarios before implementation clarifies requirements and reduces rework
- **POM pays off at scale** — initial setup takes longer but maintenance effort drops significantly as the suite grows
- **API tests complement UI tests** — backend validation catches defects faster and with less environmental dependency
- **CI integration should be set up early** — retrofitting pipelines is harder than building them alongside the tests
- **Retries require discipline** — it is tempting to rely on retries for stability; root cause fixes are always preferable
- **Third-party apps change without warning** — frequent smoke test runs are the fastest way to detect application changes before they cascade into larger failures
- **Form behavior must be observed manually first** — auto-fill, field ordering dependencies, and dynamic validation are invisible to automation until the real user flow is understood
- **Browser differences are real** — Chrome and Firefox behave differently under headless execution; timeouts and rendering speeds must be tuned per browser

---

*Document version: 1.1 | Project: wdio-cucumber-e2e-framework | Program: EPAM Testing Automation*
