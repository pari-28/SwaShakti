# SwaShakti Risk-Scoring Methodology

## 1. Purpose

SwaShakti calculates city-level and area-level risk scores using categorized public-reference incidents and submitted community reports. The scores are intended to support safety awareness and risk visualization.

The current implementation uses manually assigned category weights and fixed risk-level thresholds. These values are provisional and have not yet been empirically validated.

## 2. Data Sources

### Public Reference Data
Records stored in `PublicReferenceIncident` represent imported public-reference data. Depending on the dataset, records may describe historical incidents or aggregate statistics. They should not automatically be interpreted as verified, individually geolocated incidents.

### Community Reports
Records stored in `CommunityReport` represent reports submitted by users through SwaShakti. The current city-risk calculation includes reports whose status is `SUBMITTED`.

The two sources remain logically distinct, even when their records contribute to a combined risk score.

## 3. Current Category Weights

### Public-Reference Incident Weights

| Category | Weight |
|---|---:|
| HOMICIDE | 10 |
| SEXUAL ASSAULT | 10 |
| KIDNAPPING | 9 |
| ASSAULT | 8 |
| ROBBERY | 8 |
| EXTORTION | 7 |
| ARSON | 7 |
| BURGLARY | 6 |
| VEHICLE - STOLEN | 5 |
| DRUG OFFENSE | 5 |
| VANDALISM | 4 |
| CYBERCRIME | 4 |
| IDENTITY THEFT | 3 |
| FRAUD | 3 |
| COUNTERFEITING | 3 |
| PUBLIC INTOXICATION | 2 |

Missing or unrecognized categories receive a fallback weight of 3.

### Community-Report Weights

| Category | Weight |
|---|---:|
| HARASSMENT | 7 |
| STALKING | 8 |
| UNSAFE AREA | 6 |
| THEFT | 5 |
| ASSAULT | 8 |
| VERBAL ABUSE | 5 |
| SUSPICIOUS ACTIVITY | 6 |
| OTHER | 3 |

Missing or unrecognized categories receive a fallback weight of 3.

**Status:** These weights reflect the current implementation. They are provisional values, not validated statistical estimates or an officially established severity standard.

## 4. Current Scoring Formula

The implementation calculates the average assigned category weight and multiplies it by 10:

Risk Score = (Sum of Category Weights / Incident Count) × 10

For example, if three records have weights 8, 6, and 4:

- Total weight: 18
- Record count: 3
- Average weight: 6
- Calculated score: 60
- Assigned risk level: MEDIUM

The example is illustrative and does not represent actual SwaShakti incident data.

## 5. Risk-Level Thresholds

| Risk level | Score range |
|---|---|
| LOW | Below 40 |
| MEDIUM | 40 to below 70 |
| HIGH | 70 or above |

These thresholds are fixed constants in the current implementation. They have not yet been validated against observed safety outcomes.

## 6. Interpretation

The current score primarily represents the average assigned severity of the included categories.

It does not directly represent:
- The probability of an incident occurring.
- The expected number of future incidents.
- A statistically calibrated measure of personal safety.
- A validated comparison of crime rates between cities.

Because the calculation uses an average, two cities with different record counts can receive the same score when their average category weights are equal.

## 7. Current Implementation Notes

- Public-reference incidents and submitted community reports contribute to the combined city score.
- Records without a city are excluded from the city-level calculation.
- Community reports must have `SUBMITTED` status to be included.
- Category matching is case-insensitive after converting the category to uppercase.
- Missing and unrecognized categories receive weight 3.
- City names are trimmed before grouping in `getCityRisk()`. Differently capitalized city names may still be grouped separately.
- The returned city risk score is rounded to two decimal places.
- Results are sorted by descending risk score.

## 8. Limitations and Future Validation

The following limitations should be considered before interpreting the scores as evidence of actual risk:

1. **Provisional weights:** The current category weights are manually assigned and lack documented empirical validation.
2. **Frequency sensitivity:** Incident count does not directly increase the score when the average category weight remains unchanged.
3. **Source differences:** Public-reference records and user-submitted reports may differ in coverage, reliability, reporting practices, and geographic precision.
4. **Dataset limitations:** Aggregate public statistics should not be treated as individual incident locations unless the underlying data supports that interpretation.
5. **Fallback categories:** Assigning a weight of 3 to unknown categories is a software fallback, not a verified severity assessment.
6. **Threshold validation:** The LOW, MEDIUM, and HIGH boundaries require evaluation before being described as validated safety classifications.
7. **Geographic coverage:** A low score or absence of records does not establish that a city or area is safe. It may reflect limited data availability.

Future improvements may evaluate severity and incident frequency separately, document the rationale for category weights, assess source quality and geographic coverage, and validate thresholds against appropriate historical outcomes.

## 9. Change-Control Note

This document describes the existing implementation. It does not authorize changes to category weights, scoring formulas, risk thresholds, or the behavior of existing safety features.

Any proposed scoring changes should be reviewed and approved before implementation.


## 10. Area-Level Risk Calculation

The area-risk service is implemented in `backend/src/services/risk/communityRiskService.ts`.

### Formula

Area-level risk uses the same formula as city-level risk:

Risk Score = (Sum of Category Weights / Combined Incident Count) × 10

The service applies the same LOW, MEDIUM, and HIGH thresholds and the same public-reference and community-report category weights.

### Source Inclusion

- Community reports are included only when their status is `SUBMITTED`.
- Public-reference records are queried separately from community reports.
- Records with unusable location values are excluded from area-level aggregation.
- The service tracks the combined record count alongside separate public-reference and community-report counts.
- The `dataSource` field identifies whether the result uses public-reference data, community reports, or both.

### Location Grouping

The service normalizes whitespace and location casing for grouping, removes certain state and country suffixes, and recognizes a small set of configured aliases.

Community reports are grouped using their free-text `location` field. Public-reference records are grouped using their `city` field. Consequently, a result can represent different geographic granularities depending on the source.

The city-risk service and area-risk service use different grouping approaches. Their results should not automatically be treated as equivalent or directly comparable.

### Coordinates

The area-risk service can use coordinates stored with community reports or configured city coordinates from `CITY_COORDINATES`. Public-reference records may also supply coordinates, subject to the service's coordinate-selection logic.

Configured city coordinates represent city-level reference points; they do not establish the precise location of an individual incident.

### Additional Limitations

- The average-weight formula does not directly account for incident frequency.
- Public-reference data and community reports can differ in reliability, geographic precision, and coverage.
- Location normalization cannot guarantee that different spellings refer to the same real-world place.
- A city-level public-reference record should not be interpreted as a precise neighborhood incident.
- Source counts and geographic granularity should be considered when interpreting risk scores.
