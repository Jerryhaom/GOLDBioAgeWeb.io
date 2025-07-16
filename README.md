<p align="center"><strong>Information for GOLD and Light BioAge calculation </strong></p>

We independently fitted the GOLD and Light BioAge models to the NHANES and UKB datasets, with coefficients provided for each (**Table 1**). Similarly, benchmark models (KDM, PhenoAge) were developed within each dataset (NHANES and UKB, respectively). Additionally, we develop a Chinese population-specific version of Light BioAge (**Table 2**) using CHARLS 2011 and 2015 wave data, adjusted for population differences. This model is publicly available to enable further investigation of Light BioAge's relationship to other health factors, using the epidemiological data of CHARLS.

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
| LYM%     | Immune      | %                   | 0.2032                | -0.1899             |
| WBC      | Immune      | 1000 cells/uL       | 0.4459                | 0.9120              |
| GGT      | Kidney      | U/L                 | -0.0608               | 0.1007              |
| Constant (β0) |        |                     | -53.6287              | -78.6519            |

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

Due to its non-normal distribution, CRP was log-transformed. Log CRP was calculated as ln(CRP + 1). <br>
Note that CRP units differ: mg/dL in NHANES versus mg/L in UKB and CHARLS. For high-sensitivity CRP, we recommend using the UKB-derived coefficients.

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
| Log CRP, mean (SD), mg/L         | 1.26 (0.79)              | 1.00 (0.65)             |

Log CRP is calculated as the natural logarithm of (CRP + 1). <br>

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
| logCRP, mean (SD), mg/L         | 0.94 (0.68)             | 1.00 (0.78)             | 1.29 (0.64)             |

Log CRP is calculated as the natural logarithm of (CRP + 1). <br>
