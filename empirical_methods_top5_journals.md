# Empirical Methods in TOP 5 Economics Journals (2022–2025)

## Overview: Method Frequency Trends

Based on analysis of 44,000+ NBER/CEPR working papers (1980–2023) and TOP 5 journal publications, causal inference methods have grown from ~4% of claims in 1990 to ~28% by 2020. The ranking of methods by frequency in recent applied micro publications:

| Rank | Method | Approximate Share (recent years) | Trend |
|------|--------|----------------------------------|-------|
| 1 | **Difference-in-Differences (DiD)** | >15% of papers | Dominant, accelerating |
| 2 | **Randomized Controlled Trials (RCTs)** | ~7% | Rapid growth since 2000 |
| 3 | **Instrumental Variables (IV/2SLS)** | ~6% | Steady, mature |
| 4 | **Event Studies** | ~4-5% | Growing rapidly |
| 5 | **Regression Discontinuity (RDD)** | ~2-3% | Steady growth |
| 6 | **Structural Estimation** | ~3-4% | Stable |
| 7 | **Synthetic Control** | ~1-2% | Growing |
| 8 | **Bunching** | ~1% | Emerging |
| 9 | **Shift-Share (Bartik) IV** | ~1% | Growing |
| 10 | **Local Projections** | ~2% (macro) | Rapidly growing in macro |

**Key insight**: DiD is the single most widely adopted causal method. RCTs have overtaken IV in frequency since ~2015. The field has shifted from primarily theoretical work (20% in 1980 → <10% by 2023).

---

## 1. Instrumental Variables (IV / 2SLS)

### Paper 1: Eviction and Poverty in American Cities
- **Authors**: Robert Collinson, John Eric Humphries, Nicholas Mader, Davin Reed, Daniel Tannenbaum, Winnie van Dijk
- **Journal**: *Quarterly Journal of Economics*, Vol. 139, Issue 1, 2024, pp. 57–120
- **Method**: **Judge-leniency IV (examiner design)**
- **Identification**: Cases randomly assigned to judges with varying eviction leniency → exogenous variation in eviction orders
- **Finding**: Eviction increases homelessness and hospital visits; reduces earnings
- **Why excellent for teaching**: 
  - Classic "examiner design" — randomization of cases to judges provides clean first stage
  - Clear exclusion restriction argument (judge affects outcome only through eviction decision)
  - Replicable framework applicable to criminal justice, disability, immigration contexts
  - Data publicly available; clear first-stage F-statistics reported

### Paper 2: The Trade-Off between Flexibility and Robustness in Instrumental Variables Analysis
- **Authors**: Ben Deaner
- **Journal**: *American Economic Review*, Vol. 115, Issue 11, 2025, pp. 3975–3998
- **Method**: **IV methodology/theory paper**
- **Identification**: Analyzes robustness of IV estimates to violations of exclusion restriction
- **Why excellent for teaching**:
  - Demonstrates frontier of IV theory — when can we relax assumptions?
  - Useful for teaching sensitivity analysis in IV settings
  - Published in AER, establishing new best practices

### Paper 3: Discrimination in Multiphase Systems: Evidence from Child Protection
- **Authors**: E. Jason Baron, Joseph J. Doyle, Natalia Emanuel, Peter Hull, Joseph Ryan
- **Journal**: *Quarterly Journal of Economics*, Vol. 139, Issue 3, 2024, pp. 1611–1664
- **Method**: **Quasi-random examiner assignment IV**
- **Identification**: Random assignment of hotline screeners and investigators → two-stage examiner design
- **Finding**: Racial discrimination compounds across decision stages in child protection
- **Why excellent for teaching**:
  - Multi-stage examiner design (extension of judge IV)
  - Demonstrates how to stack IV across multiple decision points
  - Peter Hull is leading methodologist on examiner designs
  - Clear LATE interpretation

---

## 2. Regression Discontinuity Design (RDD)

### Paper 1: Large-Scale Education Reform in General Equilibrium: Regression Discontinuity Evidence from India
- **Authors**: Gaurav Khanna
- **Journal**: *Journal of Political Economy*, Vol. 131, Issue 2, 2023
- **Method**: **Sharp/Fuzzy RDD** combined with structural model
- **Identification**: Indian government policy created discontinuity in school access based on population thresholds
- **Finding**: Returns to education are 13.4% per year; general equilibrium effects reduce partial equilibrium estimates
- **Why excellent for teaching**:
  - Combines RDD with GE structural model — shows how reduced-form and structural approaches complement
  - Clear running variable (population threshold)
  - Policy-relevant (education expansion in developing country)
  - Demonstrates geographic RDD

### Paper 2: Visual Inference and Graphical Representation in Regression Discontinuity Designs
- **Authors**: Christina Korting, Carl Lieberman, Jordan Matsudaira, Zhuan Pei, Yi Shen
- **Journal**: *Quarterly Journal of Economics*, Vol. 138, Issue 3, 2023, pp. 1977–2019
- **Method**: **RDD methodology paper** (visual diagnostics)
- **Identification**: Studies how accurately human readers identify discontinuities in RD graphs
- **Finding**: Provides guidance on optimal graphical presentation for RD designs
- **Why excellent for teaching**:
  - Meta-methodological: teaches how to *present* RDD results
  - Provides practical recommendations for bin width, polynomial order in graphs
  - Useful as companion reading for any RDD application

### Paper 3: Revolutionary Transition: Inheritance Change and Fertility Decline
- **Authors**: Guillaume Daudin, Raphaël Franck, Hillel Rapoport
- **Journal**: *Journal of Political Economy*, Vol. 134, Issue 6, 2026
- **Method**: **Combined DiD + RDD**
- **Identification**: Compares cohorts of fertile age vs. too-old cohorts in 1793, across municipalities with different inheritance reform exposure
- **Finding**: French Revolution inheritance reforms reduced fertility by 0.5 children
- **Why excellent for teaching**:
  - Combines two methods (DiD + RDD) — shows how designs can be stacked
  - Historical natural experiment with rich variation
  - Clear cohort-based discontinuity

---

## 3. Difference-in-Differences (DiD)

### Paper 1: From Fog to Smog: The Value of Pollution Information
- **Authors**: Panle Jia Barwick, Shanjun Li, Liguo Lin, Eric Yongchen Zou
- **Journal**: *American Economic Review*, Vol. 114, Issue 5, 2024
- **Method**: **Staggered DiD / event study**
- **Identification**: China's 2013 air quality monitoring program rolled out across cities at different times
- **Finding**: Public access to pollution data significantly changed health behaviors; benefits outweigh costs by order of magnitude
- **Why excellent for teaching**:
  - Staggered rollout provides clean treatment variation
  - Event study graphs clearly show pre-trends and treatment effects
  - Policy-relevant in developing country context
  - Large sample with rich administrative data

### Paper 2: Answering the Call of Automation: How the Labor Market Adjusted to Mechanizing Telephone Operation
- **Authors**: James Feigenbaum, Daniel P. Gross
- **Journal**: *Quarterly Journal of Economics*, Vol. 139, Issue 3, 2024, pp. 1879–1939
- **Method**: **Difference-in-Differences** with variation in automation timing
- **Identification**: Cities adopted mechanical telephone switching at different times → variation in automation exposure
- **Finding**: Displaced telephone operators experienced short-run earnings losses but transitioned to other occupations
- **Why excellent for teaching**:
  - Clean historical natural experiment
  - Staggered adoption creates ideal DiD setting
  - Highly relevant to modern automation debates
  - Linked census data enables long-run tracking

### Paper 3: How the 1963 Equal Pay Act and 1964 Civil Rights Act Shaped the Gender Gap in Pay
- **Authors**: Martha J. Bailey, Thomas Helgerman, Bryan A. Stuart
- **Journal**: *Quarterly Journal of Economics*, Vol. 139, Issue 3, 2024, pp. 1827–1878
- **Method**: **Difference-in-Differences** with cross-state variation
- **Identification**: Cross-state variation in preexisting state equal pay laws → states without prior laws experienced larger treatment from federal legislation
- **Finding**: Federal legislation significantly reduced the gender pay gap
- **Why excellent for teaching**:
  - Classic "policy DiD" with clear treatment/control groups
  - Uses variation in pre-existing state laws as control condition
  - Demonstrates how to exploit policy variation in historical data

### Key Methodological References for DiD:
- **Roth, Sant'Anna, Bilinski, Poe (2023)**: "What's Trending in Difference-in-Differences?" *Journal of Econometrics* — comprehensive synthesis of recent DiD advances
- **Roth (2023)**: "A More Credible Approach to Parallel Trends," *Review of Economic Studies*, Vol. 90, pp. 2555–2591 — tools for robust inference when parallel trends may be violated
- **Dube, Girardi, Jordà, Taylor (2023/2025)**: "A Local Projections Approach to Difference-in-Differences" — bridges LP and DiD methods

---

## 4. Time Series / Local Projections / VAR

### Paper 1: Local Projections (Review Article)
- **Authors**: Òscar Jordà, Alan M. Taylor
- **Journal**: *Journal of Economic Literature*, Vol. 63, Issue 1, March 2025, pp. 59–110
- **Method**: **Local Projections** — comprehensive methodological review
- **Content**: State-of-the-art review of LP methods including LP-IV, LP-DiD, confidence bands, and comparison with VARs
- **Why excellent for teaching**:
  - Definitive practitioner's guide by method inventors
  - Covers LP-IV for causal identification of impulse responses
  - Translates VAR/impulse response language into potential outcomes framework
  - Published in JEL — designed as teaching resource

### Paper 2: Local Projections for Applied Economics
- **Authors**: Òscar Jordà
- **Journal**: *Annual Review of Economics*, Vol. 15, 2023, pp. 607–631
- **Method**: **Local Projections** — bridge between macro and micro econometrics
- **Content**: Shows how LPs translate VARs into treatment effects language; gains from cross-pollination between macro/micro
- **Why excellent for teaching**:
  - Explicitly connects LP to difference-in-differences and potential outcomes
  - Accessible for researchers trained in either macro or micro traditions
  - Includes practical implementation guidance

### Paper 3: A Local Projections Approach to Difference-in-Differences
- **Authors**: Arindrajit Dube, Daniele Girardi, Òscar Jordà, Alan M. Taylor
- **Journal**: *Journal of Applied Econometrics*, 2025 (NBER WP 31184, 2023)
- **Method**: **LP-DiD hybrid**
- **Identification**: Shows LP framework resolves many challenges in staggered DiD with heterogeneous treatment effects
- **Why excellent for teaching**:
  - Bridges macro (LP) and micro (DiD) econometrics
  - Addresses negative weighting and heterogeneous effects problems
  - Provides practical Stata/R implementation
  - Shows unification of two major empirical traditions

### Classic Reference (still highly relevant):
- **Plagborg-Møller & Wolf (2021)**: "Local Projections and VARs Estimate the Same Impulse Responses," *Econometrica* — proves asymptotic equivalence
- **Nakamura & Steinsson (2018)**: "Identification in Macroeconomics," *Journal of Economic Perspectives* — framework for macro causal identification

---

## 5. Synthetic Control Method

### Paper 1: Synthetic Difference-in-Differences
- **Authors**: Dmitry Arkhangelsky, Susan Athey, David A. Hirshberg, Guido W. Imbens, Stefan Wager
- **Journal**: *American Economic Review*, Vol. 111, Issue 12, 2021, pp. 4088–4118
- **Method**: **Synthetic DiD** (combines synthetic control + DiD)
- **Identification**: Constructs synthetic control that reweights both units and time periods
- **Finding**: New estimator dominates pure SC and pure DiD in many settings
- **Why excellent for teaching**:
  - Unifies two major methods (SC + DiD)
  - By leading econometricians (Athey, Imbens)
  - Clear theoretical properties and practical R package (`synthdid`)
  - Demonstrates how methods evolve and combine

### Paper 2: Using Synthetic Controls: Feasibility, Data Requirements, and Methodological Aspects
- **Authors**: Alberto Abadie
- **Journal**: *Journal of Economic Literature*, Vol. 59, Issue 2, 2021, pp. 391–425
- **Method**: **Synthetic Control** — comprehensive review by method inventor
- **Content**: Definitive guide covering feasibility, data requirements, inference, and extensions
- **Why excellent for teaching**:
  - Written as practitioner's handbook by the inventor
  - Covers when SC works and when it doesn't
  - Provides practical guidance on donor pool selection, inference
  - JEL format designed for pedagogy

### Recent Applications (2024-2025):
- Synthetic control continues to be applied in policy evaluation (minimum wage, cannabis legalization, environmental regulation) though specific TOP5 2024-2025 applications are primarily in the working paper stage

---

## 6. Bunching Estimation

### Paper 1: The Cost of Consumer Collateral: Evidence from Bunching
- **Authors**: (Various)
- **Journal**: *Econometrica*, Vol. 93, Issue 3, 2025, pp. 779–819
- **Method**: **Bunching estimation** at LTV thresholds
- **Identification**: Borrowers bunch at discrete loan-to-value (LTV) thresholds due to collateral costs → excess mass reveals willingness to pay
- **Finding**: High perceived default costs in mortgage market; documents importance of collateral for reducing moral hazard
- **Why excellent for teaching**:
  - Clean application of bunching to financial economics
  - Clear kink/notch at LTV thresholds
  - Recovers structural parameters from observed bunching
  - Fresh TOP5 publication (2025)

### Paper 2: The Effect of Minimum Wages on Low-Wage Jobs (Bunching Application)
- **Authors**: Doruk Cengiz, Arindrajit Dube, Attila Lindner, Ben Zipperer
- **Journal**: *Quarterly Journal of Economics*, Vol. 134, Issue 3, 2019, pp. 1405–1455
- **Method**: **Bunching / distributional DiD**
- **Identification**: Compares employment distribution around new minimum wage cutoff before and after 138 state-level MW changes
- **Finding**: Minimum wage raises wages at the bottom without reducing overall employment
- **Why excellent for teaching**:
  - Innovative "bunching-style" approach applied to a classic question
  - Transparent graphical evidence
  - Highly cited and influential
  - Clear counterfactual construction

---

## 7. Shift-Share (Bartik) Instrumental Variables

### Paper 1: Quasi-Experimental Shift-Share Research Designs
- **Authors**: Kirill Borusyak, Peter Hull, Xavier Jaravel
- **Journal**: *Review of Economic Studies*, Vol. 89, Issue 1, 2022, pp. 181–213
- **Method**: **Shift-Share IV methodology**
- **Identification**: Framework where identification comes from quasi-random shocks (numerator) rather than shares (denominator)
- **Finding**: Provides conditions under which SSIV is valid; shows shock-level exogeneity is sufficient
- **Why excellent for teaching**:
  - Definitive theoretical framework for Bartik-style IVs
  - Clear comparison with alternative approach (Goldsmith-Pinkham et al.)
  - Practical guidance for when to use shock-based vs. share-based identification
  - Provides Stata package and replication code

### Paper 2: Bartik Instruments: What, When, Why, and How
- **Authors**: Paul Goldsmith-Pinkham, Isaac Sorkin, Henry Swift
- **Journal**: *American Economic Review*, Vol. 110, Issue 8, 2020, pp. 2586–2624
- **Method**: **Shift-Share IV (share-based identification)**
- **Identification**: Shows Bartik is equivalent to GMM with shares as instruments; identification requires share exogeneity
- **Finding**: Provides decomposition and overidentification tests for Bartik instruments
- **Why excellent for teaching**:
  - Complements Borusyak-Hull-Jaravel with alternative perspective
  - Three empirical applications (labor supply, China shock, simulated instruments)
  - Teaching both papers together shows how same tool can be justified differently
  - Practical diagnostic tools (Rotemberg weights)

---

## 8. Propensity Score / Matching / Double ML

### Note on Method Prevalence in TOP5:
Pure propensity score matching has become **less common** in TOP5 journals in recent years, as the field has moved toward:
- Doubly robust methods (combining matching/weighting with regression)
- Double/Debiased Machine Learning (DML)
- Causal forests for heterogeneous treatment effects

### Paper 1: Double/Debiased Machine Learning for Treatment and Structural Parameters
- **Authors**: Victor Chernozhukov, Denis Chetverikov, Mert Demirer, Esther Duflo, Christian Hansen, Whitney Newey, James Robins
- **Journal**: *Econometrica*, Vol. 86, Issue 1, 2018, pp. 258–298
- **Method**: **Double Machine Learning (DML)**
- **Identification**: Uses ML for nuisance parameters while maintaining valid inference for causal parameters via Neyman orthogonality
- **Why excellent for teaching**:
  - Foundation paper for modern ML + causal inference
  - Subsumes propensity score weighting as special case
  - Applicable with any ML first stage (LASSO, random forests, neural nets)
  - Widely used in TOP5 applications since 2020
  - Python/R packages available (`doubleml`)

### Paper 2: The Economic Impacts of COVID-19: Evidence from a New Public Database
- **Authors**: Raj Chetty, John N. Friedman, Michael Stepner, Opportunity Insights Team
- **Journal**: *Quarterly Journal of Economics*, Vol. 139, Issue 2, 2024, pp. 829–889
- **Method**: **Event study + heterogeneity analysis** (with reweighting/matching across areas)
- **Identification**: Uses high-frequency private sector data to track economic outcomes around COVID shock
- **Why excellent for teaching**:
  - Demonstrates modern approaches to observational causal inference
  - Publicly available data and replication package (tracktherecovery.org)
  - Combines multiple quasi-experimental approaches
  - Massive scale with transparent methods

### Methodological Frontier:
- **Athey & Imbens (2019)**: "Machine Learning Methods That Economists Should Know About," *Annual Review of Economics* — covers causal forests, LASSO for variable selection
- **Athey, Tibshirani, Wager (2019)**: "Generalized Random Forests," *Annals of Statistics* — heterogeneous treatment effect estimation

---

## Summary: What Makes Each Method a Good Teaching Example

| Method | Key Teaching Criteria | Best Example Paper |
|--------|----------------------|-------------------|
| **IV/2SLS** | Clear instrument, testable first stage, exclusion restriction discussion | Collinson et al. (QJE 2024) — Judge IV |
| **RDD** | Observable running variable, manipulation tests, bandwidth sensitivity | Khanna (JPE 2023) — Population threshold |
| **DiD** | Parallel trends argument, event study graphs, staggered adoption | Barwick et al. (AER 2024) — Pollution monitoring |
| **Local Projections** | Impulse responses, comparison with VAR, LP-IV | Jordà & Taylor (JEL 2025) — Review |
| **Synthetic Control** | Small donor pool, pre-treatment fit, placebo inference | Abadie (JEL 2021) — Review |
| **Bunching** | Clear kink/notch, counterfactual density, structural recovery | Econometrica 2025 — LTV bunching |
| **Shift-Share IV** | Shock vs. share exogeneity, Rotemberg weights | Borusyak-Hull-Jaravel (REStud 2022) |
| **DML/Matching** | High-dimensional controls, doubly robust, honest inference | Chernozhukov et al. (Econometrica 2018) |

---

## Recommended Reading Sequence for Teaching

1. **Start with DiD** (most prevalent, intuitive) → Barwick et al. 2024 + Roth et al. 2023 review
2. **Then IV** (fundamental to identification) → Collinson et al. 2024 + Deaner 2025
3. **Then RDD** (visual, intuitive) → Khanna 2023 + Korting et al. 2023
4. **Then LP/Time Series** (bridge to macro) → Jordà & Taylor 2025 review
5. **Then Shift-Share** (modern IV extension) → Borusyak et al. 2022 + Goldsmith-Pinkham et al. 2020
6. **Then Synthetic Control** (small-N policy evaluation) → Abadie 2021 + Arkhangelsky et al. 2021
7. **Then Bunching** (structural from kinks) → Econometrica 2025
8. **Then DML** (frontier, ML + causality) → Chernozhukov et al. 2018

---

## Sources
- Causal Claims in Economics (NBER/CEPR analysis, 44,000+ papers, 1980–2023): https://arxiv.org/html/2501.06873v1
- Network analysis of TOP5 journals (Elsevier, 2026): decline of theory, rise of empirical work
- Individual journal article pages (AEA, Oxford Academic, University of Chicago Press)
- Jordà (2025) JEL review of Local Projections
- Roth et al. (2023) Journal of Econometrics review of DiD advances
