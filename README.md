<p align="center"><strong>Information for GOLD and Light BioAge calculation </strong></p>

We independently fitted the GOLD and Light BioAge models to the NHANES and UKB datasets, with coefficients provided for each (**Table 1**). Similarly, benchmark models (KDM, PhenoAge) were developed within each dataset (NHANES and UKB, respectively). Additionally, we develop a Chinese population-specific version of Light BioAge (**Table 2**) using CHARLS 2011 and 2015 wave data, adjusted for population differences. This model is publicly available to enable further investigation of Light BioAge's relationship to other health factors, using the epidemiological data of CHARLS.

The GOLD BioAge algorithm can be applied to independent biomarkers or datasets using the GOLDBioAge R package (available at http://github.com/Jerryhaom/GOLDBioAge). For researchers seeking a user-friendly interface, the tool is also accessible via an online web calculator (https://jerryhaom.github.io/GOLDBioAgeWeb.io/).

**Table 1.** Coefficients for calculating GOLD BioAge based on NHANES and UKB datasets.

| Variable | Category    | Units               | Coefficient in NHANES | Coefficients in UKB |
|----------|-------------|---------------------|-----------------------|---------------------|
| Age      |             | years               | 1.0000                | 1.0000              |
| CREA     | Kidney      | mg/dL               | 5.2691                | 5.3832              |
| GLU      | Metabolic   | mmol/L              | 0.5797                | 1.4168              |
| MCV      | Erythrocyte | fL                  | 0.3389                | 0.4206              |
| RDW      | Erythrocyte | %                   | 2.6445                | 3.3162              |
| ALB      | Liver       | g/dL                | -4.7358               | -5.0793             |
| ALP      | Liver       | U/L                 | 0.0260                 | 0.0385              |
| LYM%     | Immune      | %                   | -0.2032               | -0.1899             |
| WBC      | Immune      | 1000 cells/uL       | 0.4459                | 0.9120              |
| GGT      | Liver       | U/L                 | 0.0608                | 0.1007              |
| Constant (β0) |        |                     | -53.6287              | -78.6519            |

Table 1 displays coefficients rounded to four decimal places. The web calculator uses the following NHANES GOLD coefficients at the supplied precision:

```text
GOLD BioAge = age + 5.26909180 × CREA + 0.57969768 × GLU
             + 0.33888497 × MCV + 2.64452031 × RDW
             − 4.73575224 × ALB + 0.02604091 × ALP
             − 0.20318306 × LYM% + 0.44588830 × WBC
             + 0.06075152 × GGT − 53.62873
```

Use the units listed in Table 1 and enter LYM% as a percentage (for example, 30 for 30%).

<br>
<br>

**Table 2.** Coefficients for calculating Light BioAge based on NHANES, UKB and CHARLS datasets.

| Variable    | Category     | Units    | Coefficient in NHANES | Unit   | Coefficients in UKB | Unit   | Coefficients in CHARLS |
|-------------|--------------|----------|-----------------------|--------|---------------------|--------|-------------------------|
| Age         |              | years    | 1.0000                | years  | 1.0000              | years  | 1.0000                  |
| CREA        | Kidney       | mg/dL    | 8.3313                | mg/dL  | 9.0873              | mg/dL  | 5.0875                  |
| GLU         | Metabolic    | mmol/L   | 0.827                 | mmol/L | 1.7311              | mmol/L | 1.5766                  |
| Log CRP     | Inflammation | mg/dL    | 5.7305                | mg/L   | 4.1689              | mg/L   | 4.2983                  |
| Constant (β0) |             |          | -13.5298              |        | -20.1395            |        | -16.7562                |

Here, `log(CRP)` denotes the natural logarithm `ln(CRP + 1)`, calculated in R as `log1p(CRP)`. CRP must be expressed in **mg/dL for NHANES** and **mg/L for UKB and CHARLS** before taking the logarithm.

The web calculator accepts CRP in mg/dL for both datasets and converts it to mg/L (×10) before applying the UKB Light formula.

<br>
Contact Information: haombio@gmail.com <br>
Citation: M. Hao, H. Zhang, J. Wu, Y. Huang, X. Li, M. Wang, S. Wang, J. Wang, J. Chen, Z. jun Bao, L. Jin, X. Wang, Z. Hu, S. Jiang, Y. Li, Gompertz Law-Based Biological Age (GOLD BioAge): A Simple and Practical Measurement of Biological Ageing to Capture Morbidity and Mortality Risks. Adv. Sci. 2025, e01765. https://doi.org/10.1002/advs.202501765 <br>


_____________________________________________________________________________
The following are the population characteristics in the study.

**Supplementary Table 1.** The baseline characteristics of the study population.

| Demographic/Biomarkers        | NHANES (N=39,348)        | UKB (N=417,067)         |
|-------------------------------|--------------------------|-------------------------|
| Age, mean (SD), years         | 49.5 (18.04)             | 56.55 (8.09)            |
| Sex                           |                          |                         |
| Male, N (%)                   | 19,092 (48.52%)          | 193,006 (46.28%)        |
| Female, N (%)                 | 20,256 (51.48%)          | 224,061 (53.72%)        |
| **Biomarkers in GOLD BioAge**     |                          |                         |
| CREA, mean (SD), mg/dL        | 0.88 (0.26)              | 0.82 (0.21)             |
| GLU, mean (SD), mmol/L        | 5.56 (1.64)              | 5.13 (1.24)             |
| MCV, mean (SD), fL            | 89.33 (5.70)             | 91.13 (4.60)            |
| RDW, mean (SD), %             | 13.21 (1.20)             | 13.49 (0.99)            |
| ALB, mean (SD), g/dL          | 4.22 (0.36)              | 4.52 (0.26)             |
| ALP, mean (SD), U/L           | 69.81 (21.94)            | 83.6 (25.87)            |
| LYM%, mean (SD), %            | 30.44 (8.54)             | 28.91 (7.50)            |
| WBC, mean (SD), 1000 cells/uL | 7.24 (2.11)              | 6.89 (2.12)             |
| GGT, mean (SD), U/L           | 27.07 (24.98)            | 37.6 (42.26)            |
| **Biomarkers in Light BioAge**   |                          |                         |
| Age, mean (SD), years         | 49.72 (18.34)            | 56.55 (8.09)            |
| CREA, mean (SD), mg/dL        | 0.88 (0.26)              | 0.82 (0.21)             |
| GLU, mean (SD), mmol/L        | 5.48 (1.59)              | 5.12 (1.24)             |
| CRP, mean (SD), mg/L         | 4.07 (5.67)              | 2.61 (4.36)             |
| ln(1 + CRP in mg/L), mean (SD), unitless         | 1.26 (0.79)              | 1.00 (0.65)             |

This descriptive table uses CRP in mg/L before taking the logarithm; NHANES Light scoring uses mg/dL, as specified in Table 2. <br>

<br>

**Supplementary Table 2.** Demographic and Biomarker Data Across validation cohorts.

| Demographic/Biomarkers        | CHARLS (N=17,163)       | CLHLS (N=2,499)         | RuLAS (N=1,785)         |
|-------------------------------|-------------------------|-------------------------|-------------------------|
| Age, mean (SD), years         | 58.43 (10.05)           | 85.51 (12.03)           | 77 (4.27)               |
| Sex                           |                         |                         |                         |
| Male, N (%)                   | 8,038 (46.86%)          | 1,150 (46.02%)          | 839 (46.95%)            |
| Female, N (%)                 | 9,116 (53.14%)          | 1,349 (53.98%)          | 948 (53.05%)            |
| **Biomarkers in Light BioAge**    |                         |                         |                         |
| CREA, mean (SD), mg/dL        | 0.79 (0.26)             | 0.94 (0.33)             | 0.64 (0.20)             |
| GLU, mean (SD), mmol/L        | 5.99 (2.00)             | 5.36 (1.80)             | 6.2 (1.85)              |
| CRP, mean (SD), mg/L         | 2.72 (6.96)             | 3.28 (7.11)             | 4.03 (8.39)             |
| ln(1 + CRP in mg/L), mean (SD), unitless         | 0.94 (0.68)             | 1.00 (0.78)             | 1.29 (0.64)             |

This descriptive table uses CRP in mg/L before taking the logarithm. <br>


**Data consistency note for Supplementary Table 2:** the supplied CHARLS sex counts sum to 17,154, whereas the column total is 17,163. The supplied RuLAS sex counts sum to 1,787, whereas the column total is 1,785; the percentages also do not reproduce those counts using that total. These source summary values are retained pending confirmation from the underlying cohort records. They do not enter the BioAge calculation. The table must not be treated as an independently verified participant count.

## Calculation checks and R examples

For age 50, creatinine 1 mg/dL, glucose 5 mmol/L, MCV 90 fL, RDW 13%, albumin 4 g/dL, ALP 80 U/L, lymphocytes 30%, WBC 7 (1000 cells/uL), GGT 25 U/L, and CRP 0.3 mg/dL (= 3 mg/L):

| Coefficient dataset | GOLD (years) | Light (years) |
|---|---:|---:|
| NHANES | 51.10203967 | 50.43997842 |
| UKB | 50.74720000 | 53.38262256 |

The calculator rounds the result to one decimal. It applies existing cohort coefficients; it does not fit a model. The R package includes [all five original coefficient sets](https://github.com/Jerryhaom/GOLDBioAge/blob/main/Coefficients.md), [equations beside R code](https://github.com/Jerryhaom/GOLDBioAge/blob/main/docs/mathematics-and-code.md), and a [consistency audit](https://github.com/Jerryhaom/GOLDBioAge/blob/main/docs/consistency-audit.md).

Run `node --test tests/*.test.cjs` to verify all four calculator formulas, GOLD/Light tables, CRP transformations, frozen R reference cases, input validation, and model switching. When the R repository is checked out alongside this repository, also run `node tests/cross-repository.cjs` to compare the calculator against the packaged coefficient reference.
