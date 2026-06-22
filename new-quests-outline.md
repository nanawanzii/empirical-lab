# New Quest Lines — Detailed Design Outline

> Empirical Lab v0.2 expansion: IV/2SLS, RDD, Matching & Double ML, Time Series & Local Projections

---

## Metadata & Configuration

### New Skills to Register

```js
["iv", "IV/2SLS"],
["rdd", "RDD"],
["psm", "Matching/PSM"],
["dml", "Double ML"],
["ts", "Time Series"],
["lp", "Local Projections"]
```

### New Badges

| Badge ID | Badge Name | Unlock Condition |
|----------|-----------|------------------|
| `iv-master` | Instrument Wielder | Complete IV/2SLS boss |
| `rdd-master` | Discontinuity Detective | Complete RDD boss |
| `matching-master` | Counterfactual Constructor | Complete Matching/DML boss |
| `lp-master` | Impulse Tracer | Complete Time Series/LP boss |

### Prerequisites (Unlock Graph)

```
FE → DID → IV/2SLS → RDD
                  ↘ Matching/DML (can unlock after DID boss, parallel with RDD)
Time Series/LP → independent entry (unlocks after FE boss)
```

- **IV/2SLS**: Unlocks after DID & Event Study boss (`did-boss`)
- **RDD**: Unlocks after IV/2SLS boss (`iv-boss`)
- **Matching/DML**: Unlocks after DID & Event Study boss (`did-boss`), can run in parallel with IV/RDD
- **Time Series/LP**: Independent track, unlocks after FE boss (`fe-boss`)

---

## Quest 1: Instrumental Variables (IV/2SLS)

```js
{ id: "iv", title: "Instrumental Variables", reward: "Instrument Wielder",
  summary: "Endogeneity, exclusion restriction, 2SLS mechanics, weak instruments, LATE, judge-leniency IV, and Bartik/shift-share designs.",
  tags: ["IV/2SLS", "Causal Inference", "LATE"],
  levels: ["iv-1", "iv-2", "iv-3", "iv-4", "iv-5", "iv-6", "iv-7", "iv-boss"] }
```

### Level 1: The Endogeneity Problem

| Field | Value |
|-------|-------|
| **ID** | `iv-1` |
| **Title** | The Endogeneity Problem |
| **Type** | `mcq` |
| **Skills** | `["iv"]` |
| **XP** | 30 |
| **Story** | You estimate the effect of police spending on crime rates using OLS. A referee writes: "This coefficient is uninterpretable." |
| **Concept** | OLS fails when the regressor is correlated with the error term. Common sources: omitted variables (cities that spend more on police may also differ on poverty), reverse causality (high crime → more police spending), and measurement error. Endogeneity biases the OLS coefficient in an unknown direction. |
| **Question** | Why might OLS produce a biased estimate of the effect of police on crime? |
| **Options** | ["Omitted variables and reverse causality correlate the regressor with the error", "The sample size is always too small", "Fixed effects cannot be computed", "Python does not support regression"] |
| **Answer** | 0 |
| **Feedback** | Correct. When X is correlated with ε, the OLS coefficient does not identify a causal effect. |

---

### Level 2: IV Logic and Assumptions

| Field | Value |
|-------|-------|
| **ID** | `iv-2` |
| **Title** | IV Logic and Assumptions |
| **Type** | `mcq` |
| **Skills** | `["iv"]` |
| **XP** | 30 |
| **Story** | A colleague proposes using "distance to the nearest military base" as an instrument for police spending. You need to evaluate whether this is a valid IV. |
| **Concept** | A valid instrument Z must satisfy: (1) **Relevance** — Z predicts the endogenous X (first stage); (2) **Exclusion restriction** — Z affects Y only through X; (3) **Independence/Exogeneity** — Z is uncorrelated with unobserved confounders. The exclusion restriction is untestable but must be argued on institutional grounds. |
| **Question** | Which assumption requires that the instrument affects the outcome ONLY through the endogenous regressor? |
| **Options** | ["Exclusion restriction", "Relevance condition", "Homoskedasticity", "Stationarity"] |
| **Answer** | 0 |
| **Feedback** | Correct. The exclusion restriction says Z → X → Y with no direct Z → Y path. |

---

### Level 3: 2SLS Mechanics

| Field | Value |
|-------|-------|
| **ID** | `iv-3` |
| **Title** | 2SLS Mechanics |
| **Type** | `code` |
| **Skills** | `["iv"]` |
| **XP** | 35 |
| **Story** | Time to implement 2SLS. The first stage regresses the endogenous variable on the instrument(s) and exogenous controls; the second stage uses fitted values. |
| **Concept** | 2SLS proceeds in two stages: (1) First stage: X̂ = π₀ + π₁Z + γW + v; (2) Second stage: Y = β₀ + β₁X̂ + δW + ε. The reduced form (Y on Z directly) divided by the first stage gives the IV estimate: β₁ = Cov(Y,Z)/Cov(X,Z). In fixest: `feols(Y ~ exog | FE | endog ~ instrument)`. |
| **Question** | Complete the fixest IV specification: regress `wages` on `education` (endogenous) instrumented by `quarter_of_birth`, controlling for `age` with no fixed effects. |
| **Starter** | `feols(wages ~ age | 0 | _____ ~ _____, data = df)` |
| **Required** | `["education", "quarter_of_birth"]` |
| **Pattern** | `education\s*~\s*quarter_of_birth` |
| **Hint** | The endogenous variable goes on the left of ~, the instrument on the right. |
| **Feedback** | Good. fixest uses the `endog ~ instrument` syntax after the second pipe. |

---

### Level 4: First-Stage Diagnostics

| Field | Value |
|-------|-------|
| **ID** | `iv-4` |
| **Title** | First-Stage Diagnostics |
| **Type** | `mcq` |
| **Skills** | `["iv"]` |
| **XP** | 35 |
| **Story** | Your first-stage regression shows an F-statistic of 4.2 on the excluded instrument. The standard errors in the second stage look suspiciously large. |
| **Concept** | A weak instrument (first-stage F < 10, or more conservatively the Stock-Yogo critical values) means the instrument barely predicts X. Consequences: 2SLS is biased toward OLS, confidence intervals have poor coverage, and the estimator may be unreliable even in large samples. The effective F-stat (Olea & Pflueger 2013) or the tF procedure (Lee et al. 2022) are modern diagnostics. |
| **Question** | What does a first-stage F-statistic well below 10 indicate? |
| **Options** | ["The instrument is weak — IV estimates may be severely biased and unreliable", "The instrument is too strong", "The second stage is unnecessary", "Clustering should be removed"] |
| **Answer** | 0 |
| **Feedback** | Correct. Weak instruments cause finite-sample bias, size distortion, and poor inference. |

---

### Level 5: LATE and Complier Interpretation

| Field | Value |
|-------|-------|
| **ID** | `iv-5` |
| **Title** | LATE and Complier Interpretation |
| **Type** | `mcq` |
| **Skills** | `["iv"]` |
| **XP** | 35 |
| **Story** | Your IV estimates the effect of attending college on earnings, using draft lottery eligibility as the instrument. A reviewer asks: "For whom does this estimate hold?" |
| **Concept** | Under heterogeneous treatment effects and a binary instrument, IV identifies the Local Average Treatment Effect (LATE) — the effect for **compliers** (those whose treatment status is changed by the instrument). Always-takers (attend regardless of instrument) and never-takers (never attend regardless) are not in the estimand. Monotonicity assumes no defiers. |
| **Question** | The IV estimate from a draft-lottery instrument identifies the effect for which subpopulation? |
| **Options** | ["Compliers — those whose college attendance is changed by draft eligibility", "The entire population equally", "Always-takers who attend college regardless", "Never-takers who never attend college"] |
| **Answer** | 0 |
| **Feedback** | Correct. LATE applies to compliers, not the full sample. External validity requires understanding who compliers are. |

---

### Level 6: Judge/Examiner IV Design

| Field | Value |
|-------|-------|
| **ID** | `iv-6` |
| **Title** | Judge/Examiner IV Design |
| **Type** | `mcq` |
| **Skills** | `["iv"]` |
| **XP** | 40 |
| **Story** | Collinson et al. (QJE 2024) study the causal effect of eviction on tenant outcomes using quasi-random assignment of housing court judges who vary in leniency. |
| **Concept** | The judge-leniency (or examiner) design uses quasi-random assignment of cases to decision-makers (judges, examiners, loan officers) as an instrument. The instrument is typically the leave-out mean of the judge's decision rate across other cases. Key requirements: (1) conditional random assignment; (2) monotonicity (a stricter judge is stricter for everyone); (3) exclusion (judge affects outcomes only via the decision). Baron et al. (QJE 2024) formalize inference and testable implications of the examiner design. |
| **Question** | In the judge-leniency IV, what serves as the instrument for the endogenous treatment (e.g., eviction)? |
| **Options** | ["The judge's leave-out leniency rate — their tendency to evict in other cases", "The tenant's income level", "The number of court rooms", "The calendar year of filing"] |
| **Answer** | 0 |
| **Feedback** | Correct. The leave-out mean of a quasi-randomly assigned judge's decisions is the instrument, per Collinson et al. (QJE 2024). |

---

### Level 7: Shift-Share / Bartik IV

| Field | Value |
|-------|-------|
| **ID** | `iv-7` |
| **Title** | Shift-Share / Bartik Instruments |
| **Type** | `ordering` |
| **Skills** | `["iv"]` |
| **XP** | 40 |
| **Story** | You want to estimate how immigration affects local wages. Following Goldsmith-Pinkham et al. (AER 2020) and Borusyak et al. (REStud 2022), you construct a Bartik instrument combining initial settlement shares with national immigration shocks. |
| **Concept** | A shift-share (Bartik) instrument B_it = Σ_k s_{ik,0} × g_{kt} combines pre-period exposure shares (s) with aggregate shocks (g). Identification can come from exogenous shares (GPSS 2020: shares as instruments, need conditional exogeneity of each share) OR exogenous shocks (Borusyak et al. 2022: identification from many independent shocks, inference at the shock level). The researcher must argue which source of exogeneity is credible. |
| **Question** | Order the steps for implementing a shift-share IV analysis. |
| **Options** | ["Define exposure shares from a pre-period (e.g., immigrant settlement patterns)", "Identify aggregate shocks independent of local conditions (e.g., national-origin immigration flows)", "Construct the Bartik instrument as the share-weighted sum of shocks", "Argue identification source: exogenous shares (GPSS) or exogenous shocks (Borusyak et al.)", "Run first-stage and assess instrument strength", "Estimate 2SLS and interpret as LATE for complying regions"] |
| **Answer** | [0, 1, 2, 3, 4, 5] |
| **Feedback** | Correct. Shift-share IV requires clearly defining shares, shocks, construction, identification argument, diagnostics, and interpretation. |

---

### Boss: IV Policy Memo

| Field | Value |
|-------|-------|
| **ID** | `iv-boss` |
| **Title** | Housing Court Judge IV: Policy Memo |
| **Type** | `memo` |
| **Skills** | `["iv"]` |
| **XP** | 150 |
| **Badge** | `iv-master` |
| **Story** | Boss project: A legal aid organization asks you to estimate the causal effect of eviction on homelessness, earnings, and children's school outcomes. You have access to housing court records with quasi-random judge assignment. Write a policy memo explaining your IV strategy. |
| **Concept** | A credible IV memo identifies the endogenous variable, instrument, argues for the three IV assumptions, reports first-stage strength, interprets LATE, and discusses external validity limitations. |
| **Question** | Write a policy memo (200+ chars) explaining: the endogeneity problem, your judge-leniency instrument, exclusion restriction argument, first-stage F requirement, LATE interpretation (who are the compliers?), and one policy implication. |
| **Min** | 200 |
| **Required** | `["endogen", "instrument", "exclusion", "first stage", "LATE", "complier"]` |
| **Feedback** | Boss cleared. You wielded an instrument — identification, diagnostics, and interpretation in one coherent argument. |

---

## Quest 2: Regression Discontinuity (RDD)

```js
{ id: "rdd", title: "Regression Discontinuity", reward: "Discontinuity Detective",
  summary: "Running variables, bandwidth selection, local polynomial estimation, manipulation tests, fuzzy RD, and visualization best practices.",
  tags: ["RDD", "Causal Inference", "Local Randomization"],
  levels: ["rdd-1", "rdd-2", "rdd-3", "rdd-4", "rdd-5", "rdd-6", "rdd-boss"] }
```

### Level 1: Sharp RDD Concept

| Field | Value |
|-------|-------|
| **ID** | `rdd-1` |
| **Title** | Sharp RDD Concept |
| **Type** | `mcq` |
| **Skills** | `["rdd"]` |
| **XP** | 30 |
| **Story** | A scholarship program awards full tuition to students scoring ≥ 80 on a standardized exam. Students scoring 79 receive nothing. You want to estimate the causal effect of the scholarship on college completion. |
| **Concept** | In a sharp RDD, treatment switches deterministically at a known cutoff of a running variable (also called forcing variable or score). Identification comes from **local randomization**: units just above and below the cutoff are similar in all observed and unobserved characteristics, differing only in treatment. The key assumption is continuity of potential outcomes at the cutoff. |
| **Question** | In a sharp RDD, what determines whether a unit is treated? |
| **Options** | ["Whether the running variable exceeds a known cutoff", "Random assignment by a researcher", "Self-selection into treatment", "A judge's subjective decision"] |
| **Answer** | 0 |
| **Feedback** | Correct. Sharp RDD assigns treatment deterministically based on whether the score crosses the threshold. |

---

### Level 2: Bandwidth Selection

| Field | Value |
|-------|-------|
| **ID** | `rdd-2` |
| **Title** | Bandwidth Selection |
| **Type** | `mcq` |
| **Skills** | `["rdd"]` |
| **XP** | 35 |
| **Story** | You choose a bandwidth of ±2 points around the cutoff. Your advisor says "too narrow, no power." You widen to ±20. She says "too wide, bias from functional form." |
| **Concept** | Bandwidth governs the **bias-variance tradeoff**: narrow bandwidths reduce bias (only very similar units) but increase variance (fewer observations). Wide bandwidths increase precision but introduce bias if the conditional expectation function is misspecified away from the cutoff. Optimal bandwidth selectors (Imbens-Kalyanaraman 2012, Calonico-Cattaneo-Titiunik 2014) formalize this tradeoff by minimizing MSE. Robustness checks: show results across a range of bandwidths. |
| **Question** | What is the fundamental tradeoff in RDD bandwidth selection? |
| **Options** | ["Bias (from functional form misspecification) vs. variance (from fewer observations)", "Speed vs. accuracy of code execution", "Number of fixed effects vs. degrees of freedom", "Clustering level vs. sample size"] |
| **Answer** | 0 |
| **Feedback** | Correct. The MSE-optimal bandwidth balances approximation bias against estimation variance. |

---

### Level 3: Local Polynomial Estimation

| Field | Value |
|-------|-------|
| **ID** | `rdd-3` |
| **Title** | Local Polynomial Estimation |
| **Type** | `code` |
| **Skills** | `["rdd"]` |
| **XP** | 35 |
| **Story** | You implement an RDD using the `rdrobust` package. The key choice is the polynomial order and kernel function for the local regression on each side of the cutoff. |
| **Concept** | RDD estimation fits separate local polynomials on each side of the cutoff, weighted by a kernel (triangular is default). Linear local polynomials (p=1) are standard; higher orders reduce boundary bias but increase variance. The treatment effect is the discontinuity: the difference in intercepts at the cutoff. `rdrobust` (Calonico, Cattaneo, Titiunik) implements bias-corrected inference with robust confidence intervals. |
| **Question** | Complete the `rdrobust` call to estimate the RDD effect of the scholarship on college completion. |
| **Starter** | `rdrobust(Y = df$completion, X = df$score, c = _____, p = _____)` |
| **Required** | `["80", "1"]` |
| **Pattern** | `c\s*=\s*80.*p\s*=\s*1` |
| **Hint** | The cutoff is 80 (the scholarship threshold) and local linear (p=1) is standard. |
| **Feedback** | Good. rdrobust with c=80 and p=1 estimates the local linear RD effect with bias-corrected CI. |

---

### Level 4: Validity Checks

| Field | Value |
|-------|-------|
| **ID** | `rdd-4` |
| **Title** | Manipulation and Validity Checks |
| **Type** | `ordering` |
| **Skills** | `["rdd"]` |
| **XP** | 35 |
| **Story** | Before reporting your RDD estimate, you need to verify that the design is credible. Khanna (JPE 2023) provides an excellent example of thorough validity checks in an education RDD in India. |
| **Concept** | RDD validity requires: (1) **No manipulation** — agents cannot precisely sort around the cutoff. Test via McCrary (2008) density test or Cattaneo-Jansson-Ma (2020) test. (2) **Covariate balance** — predetermined covariates should be smooth through the cutoff (run RDD on each covariate as a placebo outcome). (3) **No other discontinuities** — no other programs change at the same cutoff. (4) **Robustness** — stable across bandwidths and polynomial orders. |
| **Question** | Order the RDD validity checks from first to last. |
| **Options** | ["Run McCrary/density test for manipulation of the running variable", "Check covariate balance at the cutoff (placebo RDD on pre-treatment variables)", "Verify no other policies change at the same threshold", "Show robustness across bandwidths and polynomial orders"] |
| **Answer** | [0, 1, 2, 3] |
| **Feedback** | Correct. Manipulation → covariate balance → institutional check → robustness is the standard validation sequence. |

---

### Level 5: Fuzzy RDD

| Field | Value |
|-------|-------|
| **ID** | `rdd-5` |
| **Title** | Fuzzy RDD |
| **Type** | `mcq` |
| **Skills** | `["rdd", "iv"]` |
| **XP** | 40 |
| **Story** | The scholarship threshold is 80, but some students above 80 decline the scholarship, and a few below 80 receive it through appeals. Treatment is not a deterministic function of the score. |
| **Concept** | Fuzzy RDD arises when the probability of treatment jumps at the cutoff but doesn't go from 0 to 1. This is equivalent to an IV setup where the instrument is "above cutoff" (Z = 1[X ≥ c]). The Wald estimator: τ_FRD = (jump in E[Y|X] at c) / (jump in E[D|X] at c). The numerator is the reduced-form discontinuity; the denominator is the first-stage discontinuity in treatment take-up. Like IV, fuzzy RDD estimates a LATE for compliers at the cutoff. |
| **Question** | In a fuzzy RDD, what role does the cutoff indicator play? |
| **Options** | ["It serves as an instrument for actual treatment — fuzzy RDD is IV at the cutoff", "It directly estimates ATE for the full population", "It eliminates the need for bandwidth selection", "It replaces the running variable entirely"] |
| **Answer** | 0 |
| **Feedback** | Correct. Fuzzy RDD = IV where the instrument is the cutoff indicator, identifying LATE for compliers at the threshold. |

---

### Level 6: RDD Visualization Best Practices

| Field | Value |
|-------|-------|
| **ID** | `rdd-6` |
| **Title** | RDD Visualization |
| **Type** | `mcq` |
| **Skills** | `["rdd"]` |
| **XP** | 40 |
| **Story** | Korting et al. (QJE 2023) argue that most RD plots in published papers obscure rather than reveal. They propose "visual inference" — can a viewer distinguish the real discontinuity from placebo-shuffled plots? |
| **Concept** | Best practices from Korting et al. (QJE 2023): (1) Plot raw or binned data with the fitted function overlaid — don't just show the fit. (2) Avoid fitting global polynomials that exaggerate the jump. (3) Use evenly-spaced bins of the running variable (not quantile bins). (4) Show the confidence interval on the local polynomial fit. (5) The "visual inference" test: embed the real plot among placebo plots (permute treatment around the cutoff) and check if viewers can identify it. If they can't, the discontinuity may be too fragile. |
| **Question** | According to Korting et al. (QJE 2023), which RD plot practice is most misleading? |
| **Options** | ["Fitting high-order global polynomials that mechanically create a visual gap", "Using evenly-spaced bins of the running variable", "Showing raw data points alongside the local fit", "Reporting the bandwidth used"] |
| **Answer** | 0 |
| **Feedback** | Correct. Global polynomials are sensitive to observations far from the cutoff and can fabricate visual discontinuities. |

---

### Boss: RDD Study Design

| Field | Value |
|-------|-------|
| **ID** | `rdd-boss` |
| **Title** | Scholarship Eligibility RDD |
| **Type** | `memo` |
| **Skills** | `["rdd", "iv"]` |
| **XP** | 150 |
| **Badge** | `rdd-master` |
| **Story** | Boss project: A state education board wants to know whether merit scholarships (awarded at score ≥ 80) improve 4-year graduation rates. Some students above 80 don't take up the scholarship; some below 80 receive partial aid through a different channel. Design the RDD study. |
| **Concept** | A complete RDD memo specifies: running variable, cutoff, sharp or fuzzy design, bandwidth selection procedure, polynomial order, manipulation test plan, covariate balance checks, estimation command, and interpretation of the LATE at the cutoff. |
| **Question** | Write a research design memo (200+ chars) specifying: the running variable and cutoff, whether this is sharp or fuzzy (and why), your bandwidth selection approach, validity checks (McCrary + covariate balance), estimation strategy, and what the estimate identifies (LATE at the cutoff). |
| **Min** | 200 |
| **Required** | `["running variable", "cutoff", "fuzzy", "bandwidth", "McCrary", "covariate", "LATE"]` |
| **Feedback** | Boss cleared. You designed an RDD from identification to inference — the Discontinuity Detective badge is earned. |

---

## Quest 3: Matching & Propensity Score / Double ML

```js
{ id: "matching", title: "Matching & Double ML", reward: "Counterfactual Constructor",
  summary: "Selection on observables, propensity scores, matching estimators, IPW, doubly robust estimation, and debiased machine learning.",
  tags: ["Matching", "PSM", "IPW", "AIPW", "Double ML"],
  levels: ["match-1", "match-2", "match-3", "match-4", "match-5", "match-6", "match-boss"] }
```

### Level 1: Selection on Observables

| Field | Value |
|-------|-------|
| **ID** | `match-1` |
| **Title** | Selection on Observables |
| **Type** | `mcq` |
| **Skills** | `["psm"]` |
| **XP** | 30 |
| **Story** | A government job training program is offered to all unemployed workers, but only some choose to participate. You observe demographics, prior earnings, education, and region for both participants and non-participants. |
| **Concept** | The **Conditional Independence Assumption** (CIA), also called unconfoundedness or selection on observables, states: conditional on observed covariates X, treatment assignment D is independent of potential outcomes (Y(0), Y(1)). Formally: (Y(0), Y(1)) ⊥ D | X. This means all confounders are observed — a strong and untestable assumption. If unobserved factors (e.g., motivation) also drive selection, CIA fails and you need IV or RDD instead. |
| **Question** | What does the Conditional Independence Assumption (CIA) require? |
| **Options** | ["All confounders affecting both treatment and outcome are observed and controlled for", "Treatment is randomly assigned", "The running variable crosses a cutoff", "An instrument shifts treatment status"] |
| **Answer** | 0 |
| **Feedback** | Correct. CIA assumes no unobserved confounders — selection into treatment is fully explained by observables. |

---

### Level 2: Propensity Score Logic

| Field | Value |
|-------|-------|
| **ID** | `match-2` |
| **Title** | Propensity Score Logic |
| **Type** | `mcq` |
| **Skills** | `["psm"]` |
| **XP** | 30 |
| **Story** | You have 50 covariates. Matching on all 50 dimensions simultaneously is computationally infeasible — the curse of dimensionality. Rosenbaum & Rubin (1983) proposed a solution. |
| **Concept** | The **propensity score** e(X) = P(D=1|X) is a scalar summary of covariate information. The key theorem: if CIA holds conditional on X, it also holds conditional on e(X). This reduces a high-dimensional matching problem to a one-dimensional one. The **balancing property**: within strata of equal propensity scores, the distribution of X should be the same for treated and control units. Overlap/common support: e(X) must be bounded away from 0 and 1. |
| **Question** | What problem does the propensity score solve? |
| **Options** | ["Curse of dimensionality — reduces multi-dimensional matching to a single score", "Weak instruments in 2SLS", "Manipulation of the running variable", "Serial correlation in panel data"] |
| **Answer** | 0 |
| **Feedback** | Correct. The propensity score collapses high-dimensional X into a scalar balancing score. |

---

### Level 3: Matching Estimators

| Field | Value |
|-------|-------|
| **ID** | `match-3` |
| **Title** | Matching Estimators |
| **Type** | `mcq` |
| **Skills** | `["psm"]` |
| **XP** | 35 |
| **Story** | You estimate propensity scores via logit and now must choose a matching algorithm: nearest-neighbor (with or without replacement), kernel matching, radius/caliper matching. |
| **Concept** | **Nearest-neighbor matching** pairs each treated unit with the control unit(s) having the closest propensity score. With replacement allows a control to be reused (reduces bias, increases variance). **Kernel matching** uses all controls weighted by distance in propensity score (smooth, uses more data). **Caliper matching** drops treated units without a close match (improves quality, may lose sample). After matching, check covariate balance (standardized differences < 0.1). Abadie-Imbens (2006) provide bias-corrected matching estimators and valid standard errors. |
| **Question** | What is the main advantage of nearest-neighbor matching WITH replacement over without replacement? |
| **Options** | ["Each treated unit gets the best available match, reducing bias from poor matches", "It always increases sample size", "Standard errors become exactly zero", "It eliminates the need for the propensity score"] |
| **Answer** | 0 |
| **Feedback** | Correct. With-replacement matching allows optimal pairing for each treated unit, at the cost of higher variance when few controls are reused heavily. |

---

### Level 4: Inverse Probability Weighting (IPW)

| Field | Value |
|-------|-------|
| **ID** | `match-4` |
| **Title** | Inverse Probability Weighting |
| **Type** | `fill` |
| **Skills** | `["psm"]` |
| **XP** | 35 |
| **Story** | Instead of matching, you weight each observation by the inverse of its probability of receiving the treatment it actually received. A treated unit with e(X) = 0.9 is common (low weight); one with e(X) = 0.2 is rare among treated (high weight). |
| **Concept** | IPW creates a pseudo-population where treatment is independent of X. For ATT: weight controls by e(X)/(1-e(X)). For ATE: weight treated by 1/e(X) and controls by 1/(1-e(X)). **Extreme weights** arise when propensity scores are near 0 or 1 (poor overlap) — trimming or normalized/stabilized weights help. IPW is consistent if the propensity score model is correctly specified, but can be high-variance with extreme weights. |
| **Question** | For the ATE, what is the IPW weight for a treated unit (D=1) with propensity score e(X) = 0.4? |
| **Answer** | `["2.5", "1/0.4"]` |
| **Feedback** | Correct. For treated units under ATE-IPW, weight = 1/e(X) = 1/0.4 = 2.5. |

---

### Level 5: Doubly Robust Estimation (AIPW)

| Field | Value |
|-------|-------|
| **ID** | `match-5` |
| **Title** | Doubly Robust / AIPW |
| **Type** | `mcq` |
| **Skills** | `["psm", "dml"]` |
| **XP** | 40 |
| **Story** | A co-author worries: "What if our propensity score model is wrong?" Another worries: "What if our outcome regression is wrong?" AIPW addresses both concerns simultaneously. |
| **Concept** | **Augmented Inverse Probability Weighting** (AIPW) combines an outcome model μ(X) with a propensity model e(X). The estimator is **doubly robust**: it is consistent if EITHER the outcome model OR the propensity model is correctly specified (only one needs to be right). The formula augments IPW with a bias-correction term from the outcome model. AIPW is also **locally semiparametrically efficient** — it achieves the lowest possible variance among regular estimators when both models are correct (Robins, Rotnitzky & Zhao 1994). |
| **Question** | Why is the AIPW estimator called "doubly robust"? |
| **Options** | ["It is consistent if either the propensity score or the outcome model is correctly specified", "It uses two instruments instead of one", "It requires two running variables", "It clusters at two levels simultaneously"] |
| **Answer** | 0 |
| **Feedback** | Correct. Double robustness gives you two chances to get the specification right — a major practical advantage. |

---

### Level 6: Double/Debiased ML

| Field | Value |
|-------|-------|
| **ID** | `match-6` |
| **Title** | Double/Debiased Machine Learning |
| **Type** | `mcq` |
| **Skills** | `["dml"]` |
| **XP** | 40 |
| **Story** | You have hundreds of potential confounders and want to use ML (random forests, LASSO) to model them flexibly. But plugging ML predictions naively into a treatment effect estimator introduces regularization bias. Chernozhukov et al. (Econometrica 2018) show how to fix this. |
| **Concept** | **Double/Debiased Machine Learning (DML)** solves two problems: (1) **Regularization bias** — ML models shrink predictions, biasing the treatment effect estimate. Fixed by **Neyman orthogonality**: construct a moment condition whose derivative with respect to nuisance parameters is zero, so small errors in nuisance estimation don't propagate. (2) **Overfitting bias** — using the same sample to fit nuisance models and estimate the effect causes bias. Fixed by **cross-fitting** (sample splitting): fit the ML model on a fold, predict on the held-out fold, and estimate the causal parameter on the predictions. DML achieves √n-consistent, asymptotically normal inference on the causal parameter even when nuisance functions are estimated at slower-than-√n rates. |
| **Question** | What is the role of cross-fitting in Double ML? |
| **Options** | ["Prevents overfitting bias by ensuring nuisance predictions are out-of-sample", "Replaces the need for any outcome model", "Eliminates the exclusion restriction requirement", "Selects the optimal bandwidth for RDD"] |
| **Answer** | 0 |
| **Feedback** | Correct. Cross-fitting ensures ML-estimated nuisance parameters don't overfit to the estimation sample, preserving valid inference. |

---

### Boss: Treatment Effect Memo

| Field | Value |
|-------|-------|
| **ID** | `match-boss` |
| **Title** | Job Training Program Evaluation |
| **Type** | `memo` |
| **Skills** | `["psm", "dml"]` |
| **XP** | 150 |
| **Badge** | `matching-master` |
| **Story** | Boss project: A workforce development agency asks you to evaluate a job training program using observational data. You observe rich baseline covariates (demographics, prior earnings history, education, region) but cannot run an experiment. Write a memo proposing and defending your estimation strategy. |
| **Concept** | A strong treatment-effect memo under selection on observables should: state CIA and why it might hold here, choose between matching/IPW/AIPW/DML with justification, describe covariate balance diagnostics, address overlap concerns, and interpret the estimand (ATT vs ATE). |
| **Question** | Write a policy memo (200+ chars) explaining: why CIA might hold (what confounders you observe), your estimation strategy (pick AIPW or DML and justify), how you check balance, how you handle overlap violations, and what estimand (ATT/ATE) you target and why. |
| **Min** | 200 |
| **Required** | `["CIA", "propensity", "balance", "overlap", "doubly robust", "ATT"]` |
| **Feedback** | Boss cleared. You constructed counterfactuals from observational data — the Counterfactual Constructor badge is earned. |

---

## Quest 4: Time Series & Local Projections

```js
{ id: "ts", title: "Time Series & Local Projections", reward: "Impulse Tracer",
  summary: "Stationarity, VARs, local projections, LP vs VAR tradeoffs, LP-IV, and LP-DiD for causal impulse responses.",
  tags: ["Time Series", "Local Projections", "VAR", "LP-IV", "LP-DiD"],
  levels: ["ts-1", "ts-2", "ts-3", "ts-4", "ts-5", "ts-6", "ts-boss"] }
```

### Level 1: Time Series Fundamentals

| Field | Value |
|-------|-------|
| **ID** | `ts-1` |
| **Title** | Time Series Fundamentals |
| **Type** | `mcq` |
| **Skills** | `["ts"]` |
| **XP** | 30 |
| **Story** | You receive monthly GDP growth, unemployment, and the federal funds rate. Before estimating dynamic effects, you need to assess basic time series properties. |
| **Concept** | Key properties: (1) **Stationarity** — a process is (weakly) stationary if its mean, variance, and autocovariances do not depend on time. Non-stationary series (unit roots, trends) require differencing or detrending. (2) **Autocorrelation** — observations are correlated with their own lags; this affects inference and motivates dynamic models. (3) **Trends** — deterministic (time polynomials) vs. stochastic (unit root/random walk). ADF or KPSS tests assess stationarity. Ignoring non-stationarity risks spurious regression. |
| **Question** | What does weak stationarity require of a time series? |
| **Options** | ["Constant mean, constant variance, and autocovariances that depend only on lag distance", "Observations must be independent over time", "The series must be normally distributed", "All values must be positive"] |
| **Answer** | 0 |
| **Feedback** | Correct. Weak stationarity means the first two moments and the autocovariance function are time-invariant. |

---

### Level 2: VAR Basics

| Field | Value |
|-------|-------|
| **ID** | `ts-2` |
| **Title** | VAR and Impulse Response Functions |
| **Type** | `mcq` |
| **Skills** | `["ts"]` |
| **XP** | 35 |
| **Story** | You estimate a 3-variable VAR(4) with GDP growth, inflation, and the interest rate. Your advisor asks for impulse response functions showing how a monetary policy shock propagates through the system. |
| **Concept** | A **Vector Autoregression** (VAR) models each variable as a linear function of its own lags and lags of all other variables in the system. **Impulse Response Functions** (IRFs) trace how a one-unit shock to one variable propagates to all variables over time. Identification of structural shocks requires restrictions: **Cholesky ordering** (lower triangular) assumes a recursive causal ordering — variables ordered earlier can affect later ones contemporaneously but not vice versa. The ordering matters and must be economically motivated. |
| **Question** | In Cholesky-identified VARs, what does the ordering of variables determine? |
| **Options** | ["Which variables can affect others contemporaneously — earlier variables are causally prior within the period", "The number of lags in the VAR", "The stationarity of each series", "The bandwidth for kernel estimation"] |
| **Answer** | 0 |
| **Feedback** | Correct. Cholesky ordering imposes a recursive contemporaneous causal structure — a strong and often controversial assumption. |

---

### Level 3: Local Projections Concept

| Field | Value |
|-------|-------|
| **ID** | `ts-3` |
| **Title** | Local Projections |
| **Type** | `code` |
| **Skills** | `["lp"]` |
| **XP** | 35 |
| **Story** | Jordà (AER 2005) proposes an alternative to VARs: instead of iterating a one-step-ahead model, directly regress the outcome at each horizon h on the current shock. Jordà & Taylor (JEL 2025) provide a comprehensive review. |
| **Concept** | **Local Projections** estimate impulse responses via a sequence of direct regressions: y_{t+h} = α_h + β_h · shock_t + γ_h · controls_t + ε_{t+h}, for h = 0, 1, 2, ..., H. Each horizon h gives one point on the IRF. No iteration, no inversion of a companion matrix. Advantages: robust to misspecification of the VAR lag structure, easy to add non-linearities, and naturally handles the moving-average structure in residuals (though inference requires Newey-West or clustering). |
| **Question** | Complete the local projection regression for horizon h=4 (outcome 4 periods ahead on the shock today). |
| **Starter** | `feols(lead(y, _____) ~ shock + lag(y, 1) + lag(y, 2), data = df, vcov = "NW" ~ 4)` |
| **Required** | `["4"]` |
| **Pattern** | `lead\(y,\s*4\)` |
| **Hint** | The dependent variable is y at t+h, so lead(y, 4) for horizon 4. |
| **Feedback** | Good. Each LP regression estimates one point on the impulse response, with Newey-West SEs correcting for serial correlation. |

---

### Level 4: LP vs VAR Tradeoffs

| Field | Value |
|-------|-------|
| **ID** | `ts-4` |
| **Title** | LP vs VAR |
| **Type** | `mcq` |
| **Skills** | `["lp", "ts"]` |
| **XP** | 35 |
| **Story** | Your co-author prefers VARs ("more efficient!"). You prefer LPs ("more robust!"). Jordà & Taylor (JEL 2025) lay out the tradeoffs clearly. |
| **Concept** | **VAR advantages**: more efficient when the true DGP is a finite-order VAR (all horizons estimated jointly from one model); tighter confidence bands. **LP advantages**: (1) robust to misspecification — doesn't compound errors across horizons; (2) easily incorporates state dependence, non-linearities, and external instruments; (3) doesn't require specifying the full system. **LP disadvantages**: less efficient (wider CIs), requires care with serial correlation in residuals (Newey-West/HAC or clustering). In practice, many applied researchers prefer LP for robustness and show VAR for efficiency comparison. |
| **Question** | What is the main efficiency advantage of VARs over local projections? |
| **Options** | ["VARs use all horizons jointly from one iterated model, giving tighter confidence bands when correctly specified", "VARs don't require any identifying assumptions", "VARs are always unbiased regardless of lag length", "VARs automatically correct for non-stationarity"] |
| **Answer** | 0 |
| **Feedback** | Correct. When the VAR is correctly specified, iterated IRFs are more efficient. But misspecification compounds across horizons — LP's robustness often wins in practice. |

---

### Level 5: LP-IV

| Field | Value |
|-------|-------|
| **ID** | `ts-5` |
| **Title** | LP-IV: Causal Impulse Responses |
| **Type** | `mcq` |
| **Skills** | `["lp", "iv"]` |
| **XP** | 40 |
| **Story** | You want to estimate the causal effect of monetary policy shocks on output over time. But the interest rate is endogenous (the Fed responds to economic conditions). You need an external instrument — e.g., Romer & Romer narrative shocks or high-frequency identification around FOMC announcements. |
| **Concept** | **LP-IV** combines local projections with instrumental variables: y_{t+h} = α_h + β_h · X_t + controls + ε_{t+h}, where X (e.g., interest rate change) is instrumented by Z (e.g., narrative monetary shock). This gives a causal IRF — each β_h is the causal effect at horizon h, identified by the external instrument. Requirements: Z must be relevant (predict X), exogenous (uncorrelated with confounders), and satisfy the exclusion restriction (affects y_{t+h} only through X_t). Stock & Watson (2018) and Jordà & Taylor (JEL 2025) formalize this. |
| **Question** | What does LP-IV achieve that standard LP cannot? |
| **Options** | ["Causal identification of impulse responses using an external instrument for the endogenous shock", "Wider confidence intervals for more conservative inference", "Automatic stationarity of the outcome variable", "Elimination of all serial correlation in residuals"] |
| **Answer** | 0 |
| **Feedback** | Correct. LP-IV identifies causal dynamic effects by instrumenting the endogenous variable at each horizon. |

---

### Level 6: LP-DiD Hybrid

| Field | Value |
|-------|-------|
| **ID** | `ts-6` |
| **Title** | LP-DiD: Bridging Micro and Macro |
| **Type** | `mcq` |
| **Skills** | `["lp", "did"]` |
| **XP** | 40 |
| **Story** | Dube, Girardi, Jordà & Taylor develop LP-DiD — combining the local projection framework with difference-in-differences for panel settings with staggered treatment. This bridges microeconometric causal inference with macroeconometric dynamics. |
| **Concept** | **LP-DiD** estimates dynamic treatment effects in panel data by running local projections of the form: y_{i,t+h} - y_{i,t-1} = α_h + β_h · D_{it} + controls + ε_{i,t+h}. The differencing (or inclusion of unit FE) handles time-invariant confounders; the LP framework traces effects over time without imposing a parametric lag structure. Advantages over event-study with leads/lags: (1) cleaner separation of horizons; (2) avoids issues with relative-time dummies in staggered settings; (3) naturally handles heterogeneous treatment timing. Clean counterfactual: only not-yet-treated units serve as controls at each horizon. |
| **Question** | How does LP-DiD improve upon standard event-study specifications in staggered settings? |
| **Options** | ["It uses not-yet-treated units as clean controls at each horizon, avoiding contamination from already-treated units", "It eliminates the need for parallel trends assumptions", "It requires no panel data structure", "It always produces narrower confidence intervals than TWFE"] |
| **Answer** | 0 |
| **Feedback** | Correct. LP-DiD naturally handles staggered timing by using only clean controls at each projection horizon, avoiding the "bad comparison" problem of TWFE event studies. |

---

### Boss: Macro Policy Impulse Responses

| Field | Value |
|-------|-------|
| **ID** | `ts-boss` |
| **Title** | Macro Policy Shock: Impulse Responses |
| **Type** | `memo` |
| **Skills** | `["ts", "lp", "iv"]` |
| **XP** | 150 |
| **Badge** | `lp-master` |
| **Story** | Boss project: A central bank research department asks you to estimate how an unexpected 25bp interest rate hike propagates to GDP growth, unemployment, and inflation over 24 months. You have a narrative shock series (à la Romer & Romer) as an external instrument. Write a research design memo. |
| **Concept** | A complete LP-IV memo should specify: the endogenous shock, the external instrument and why it satisfies IV assumptions, the LP specification (horizons, controls, lag structure), inference method (Newey-West or cluster), comparison with VAR-based IRFs, and interpretation of the dynamic causal effects. |
| **Question** | Write a research design memo (200+ chars) explaining: the endogeneity problem (why raw interest rate changes aren't causal), your external instrument (narrative shock) and its validity, the LP-IV specification for horizons 0-24, how you handle inference with serially correlated residuals, and how you'd compare results with a Cholesky VAR. |
| **Min** | 200 |
| **Required** | `["endogen", "instrument", "local projection", "horizon", "Newey-West", "VAR"]` |
| **Feedback** | Boss cleared. You traced impulse responses with causal identification — the Impulse Tracer badge is earned. |

---

## Summary: Quest Configuration for app.js

### Quests Array Addition

```js
{ id: "iv", title: "Instrumental Variables", reward: "Instrument Wielder",
  summary: "Endogeneity, exclusion restriction, 2SLS, weak instruments, LATE, judge-leniency, and Bartik designs.",
  tags: ["IV/2SLS", "Causal Inference", "LATE"],
  levels: ["iv-1","iv-2","iv-3","iv-4","iv-5","iv-6","iv-7","iv-boss"] },

{ id: "rdd", title: "Regression Discontinuity", reward: "Discontinuity Detective",
  summary: "Running variables, bandwidth, local polynomials, manipulation tests, fuzzy RD, and visualization.",
  tags: ["RDD", "Causal Inference", "Local Randomization"],
  levels: ["rdd-1","rdd-2","rdd-3","rdd-4","rdd-5","rdd-6","rdd-boss"] },

{ id: "matching", title: "Matching & Double ML", reward: "Counterfactual Constructor",
  summary: "CIA, propensity scores, matching, IPW, AIPW, and debiased machine learning.",
  tags: ["Matching", "PSM", "IPW", "AIPW", "Double ML"],
  levels: ["match-1","match-2","match-3","match-4","match-5","match-6","match-boss"] },

{ id: "ts", title: "Time Series & Local Projections", reward: "Impulse Tracer",
  summary: "Stationarity, VARs, local projections, LP-IV, and LP-DiD for causal dynamics.",
  tags: ["Time Series", "Local Projections", "VAR", "LP-IV", "LP-DiD"],
  levels: ["ts-1","ts-2","ts-3","ts-4","ts-5","ts-6","ts-boss"] }
```

### Skills Array Addition

```js
["iv", "IV/2SLS"],
["rdd", "RDD"],
["psm", "Matching/PSM"],
["dml", "Double ML"],
["ts", "Time Series"],
["lp", "Local Projections"]
```

### Badges Array Addition

```js
["iv-master", "Instrument Wielder", "Complete the IV/2SLS boss: policy memo with judge-leniency IV."],
["rdd-master", "Discontinuity Detective", "Complete the RDD boss: scholarship eligibility study design."],
["matching-master", "Counterfactual Constructor", "Complete the Matching/DML boss: job training evaluation memo."],
["lp-master", "Impulse Tracer", "Complete the Time Series/LP boss: macro policy IRF estimation."]
```

### Total Content Added

| Quest | Levels | Boss | Total XP |
|-------|--------|------|----------|
| IV/2SLS | 7 | 1 | 395 |
| RDD | 6 | 1 | 365 |
| Matching/DML | 6 | 1 | 360 |
| Time Series/LP | 6 | 1 | 365 |
| **Total** | **25** | **4** | **1,485** |

### Reference Papers Used

| Paper | Quest | Level |
|-------|-------|-------|
| Collinson et al. (QJE 2024) — Judge-leniency IV on eviction | IV | L6, Boss |
| Baron et al. (QJE 2024) — Examiner design | IV | L6 |
| Goldsmith-Pinkham et al. (AER 2020) — Bartik IV | IV | L7 |
| Borusyak et al. (REStud 2022) — Shift-share | IV | L7 |
| Khanna (JPE 2023) — Education RDD in India | RDD | L4 |
| Korting et al. (QJE 2023) — Visual inference in RD | RDD | L6 |
| Chernozhukov et al. (Econometrica 2018) — DML | Matching | L6 |
| Jordà & Taylor (JEL 2025) — LP review | TS/LP | L3, L4 |
| Dube, Girardi, Jordà & Taylor — LP-DiD | TS/LP | L6 |
