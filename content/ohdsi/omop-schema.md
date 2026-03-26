---
title: Schema
---
Based on :
https://github.com/OHDSI/CommonDataModel/blob/main/inst/ddl/5.4/postgresql/OMOPCDM_postgresql_5.4_ddl.sql

more references (claude) :
https://claude.ai/chat/eef987c9-f664-46d8-a139-eb966135f96d

### Standardized clinical data
Describes clinical data records 

### person
```
interface person {
    person_id: number
    gender_concept_id: number
    year_of_birth: number
    month_of_birth: number
    day_of_birth: number
    birth_datetime: string //datetime
    race_concept_id: integer
    ethnicity_concept_id: number
    location_id?: number
    provider_id?: number
    care_site_id?: number
    person_source_value?: string
    gender_source_value?: string
    gender_source_concept_id?: number
    race_source_value?: string
    race_source_concept_id?: number
    ethnicity_source_value?: string
    ethnicity_source_concept_id?: number
}
```

### observation_period
```
interface observation_period {
    observation_period_id: number
    person_id: number
    observation_period_start_date: string
    observation_period_end_date: string
    period_type_concent_id: string
}
```

### visit_occurence
```
interface visit_occurence {
    visit_occurence_id: number
    person_id: number
    visit_concept_id: number
    visit_start_date: string
    visit_start_datetime: string
    visit_end_date: string
    visit_end_datetime: string
    visit_type_concept_id: number
    provider_id?: number
    care_site_id?: number
    visit_source_value?: string
    visit_source_concept_id?: number
    admitted_from_concept_id?: number
    admitted_from_source_value?: string
    discharged_to_concept_id?: number
    discharged_to_source_value?: string
    preceding_visit_occurence_id?: number
}
```

### visit_detail
```
interface visit_detail {
    visit_detail_id: number
    person_id: number
    visit_detail_concept_id: number
    visit_detail_start_date: string
    visit_detail_start_datetime?: string
    visit_detail_end_date: string
    visit_detail_end_datetime?: string
    visit_detail_type_concept_id: number
    provider_id?: number
    care_site_id?: number
    visit_detail_source_value?: string
    visit_detail_source_concept_id?: number
    admitted_from_concept_id?: number
    admitted_from_source_value?: string
    discharged_to_source_value?: string
    discharged_to_concept_id?: number
    preceding_visit_detail_id?: number
    parent_visit_detail_id?: number
    visit_occurence_id: number
}
```

### condition_occurence
```
interface condition_occurence {
    condition_occurence_id: number
    person_id: number
    condition_start_date: string
    condition_start_datetime?: string
    condition_end_date?: string
    condition_end_datetime?: string
    condition_type_concept_id?: number
    condition_status_concept_id?: number
    stop_reason?: string
    provider_id?: number
    visit_occurence_id?: number
    visit_detail_id?: number
    condition_source_value?: string
    condition_source_concept_id?: number
    condition_status_source_value?: string
}
```

### drug_exposure
```
interface drug_exposure {
    drug_exposure_id: number
    person_id: number
    drug_concept_id: number
    drug_exposure_start_date: string
    drug_exposure_start_datetime?: string
    drug_exposure_end_date: string
    drug_exposure_end_datetime?: string
    verbatim_end_date: string
    drug_type_concept_id: number
    stop_reason?: string
    refills?: number // The n of refills authorized beyond the original fill
    quantity?: number
    days_supply?: number
    sig?: string // latin for instruction
    route_concept_id?: number // concept like oral, intravenous, topical etc
    lot_number?: string
    provider_id?: number
    visit_occurence_id?: number
    visit_detail_id?: number
    drug_source_value?: string
    drug_source_concept_id?: number
    route_source_value?: string
    dose_unit_source_value?: string
}
```

### procedure_occurence
```
interface procedure_occurence {
    procuder_occurence_id: number
    person_id: number
    procedure_concept_id: number
    procedure_date: string
    procedure_datetime?: string
    procedure_end_date?: string
    procedure_end_datetime?: string
    procedure_type_concept_id?: number
    modifier_concept_id?: number
    quantity?: number
    provider_id?: number
    visit_occurence_id?: number
    visit_detail_id?: number
    procedure_source_value?: string
    procedure_source_concept_id?: string
    modifier_source_value?: string
}
```

### device_exposure
```
interface device_exposure {
    device_exposure_id: number
    person_id: number
    device_concept_id: number
    device_exposure_start_date: string
    device_exposure_start_datetime?: string
    device_exposure_end_date?: string
    device_exposure_end_datetime?: string
    device_type_concept_id: number
    unique_device_id?: string
    production_id?: string
    quantity?: number
    provider_id?: number
    visit_occurence_id?: number
    visit_detail_id?: number
    device_source_value?: string
    device_source_concept_id?: number
    unit_concept_id?: number
    unit_source_value?: number
    unit_source_concept_id?: number
}
```

### measurement
```
interface measurement {
    measurement_id: number
    person_id: number
    measurement_concept_id: number
    measurement_date: string
    measurement_datetime?: string
    measurement_time: string
    measurement_type_concept_id: number
    operator_concept_id?: number
    value_as_number?: number
    value_as_concept_id?: number
    unit_concept_id?: number
    range_low?: number
    range_high?: number
    provider_id?: number
    visit_occurence_id?: number
    visit_detail_id?: number
    measurement_source_value?: string
    measurement_source_concept_id?: number
    unit_source_value?: string
    unit_source_concept_id?: number
    value_source_value?: string
    measurement_event_id?: number
    meas_event_field_concept_id?: number
}
```

### observation
```
interface observation {
    observation_id: number
    person_id: number
    observation_concept_id: number
    observation_date: string
    observation_datetime?: string
    observation_type_concept_id: number
    value_as_number?: number
    value_as_string?: number
    value_as_concept_id?: number
    qualifier_concept_id?: number
    unit_concept_id?: number
    provider_id?: number
    visit_occurence_id?: number
    visit_detail_id?: number
    observation_source_value?: string
    observation_source_concept_id?: number
    unit_source_value?: string
    value_source_value?: string
    observation_event_id?: number
    obs_event_field_concept_id?: number
}
```

### death
```
interface death {
    person_id: number
    death_date: string
    death_datetime?: string
    death_type_concept_id?: number
    cause_concept_id?: number
    cause_source_value?: string
    cause_source_concept_id?: number
}
```

### note
```
interface note {
    note_id: number
    person_id: number
    note_date: string
    note_datetime?: string
    note_type_concept_id: number
    note_class_concept_id: number
    note_title?: string
    note_text: string
    encoding_concept_id: number
    language_concept_id: number
    provider_id?: number
    visit_occurence_id?: number
    visit_detail_id?: number
    note_source_value?: string
    note_event_id?: number
    note_event_field_concept_id?: number
}
```

### note_nlp
```
interface note_nlp {
    note_nlp_id: number
    note_id: number
    section_concept_id?: number
    snippet?: string
    offset?: string
    lexical_variant?: string
    note_nlp_concept_id?: number
    note_nlp_source_concept_id?: number
    nlp_system?: string
    nlp_date: string
    nlp_datetime?: string
    term_exists?: boolean
    term_temporal?: string
    term_modifier?: string
}
```

### specimen
```
interface specimen {
    specimen_id: number
    person_id: number
    specimen_concept_id: number
    specimen_type_concept_id: number
    specimen_date: string
    specimen_datetime?: string
    quantity?: number
    unit_concept_id?: number
    anatomic_site_concept_id?: number
    disease_status_concept_id?: number
    specimen_source_id?: string
    specimen_source_value?: string
    unit_source_value?: string
    anatomic_site_source_value?: string
    disease_status_source_value?: string
}
```

### fact_relationship
```
interface fact_relationship {
    domain_concept_id_1: number
    fact_id_1: number
    domain_concept_id_2: number
    fact_id_2: number
    relationship_concept_id: number
}
```

### location
```
interface location {
    location_id: number
    address_1?: string
    address_2?: string
    city?: string
    state?: string
    zip?: string
    county?: string
    location_source_value?: string
    country_concept_id?: number
    country_source_value?: number
    latitude?: string
    longitude?: string
}
```

### care_site
```
interface care_site {
    care_site_id: number
    care_site_name?: string
    place_of_service_concept_id?: number
    location_id?: number
    care_site_source_value?: string
    place_of_service_source_value?: string
}
```

### provider
```
interface provider {
    provider_id: number
    provider_name?: string
    npi?: string
    dea?: string
    specialty_concept_id?: number
    care_site_id?: number
    year_of_birth?: number
    gender_concept_id?: number
    provider_source_value?: string
    specialty_source_value?: string
    specialty_source_concept_id?: number
    gender_source_value?: number
    gender_source_concept_id?: number
}
```

### payer_plan_period
```
interface payer_plan_period {
    payer_plan_period_id: number
    person_id: number
    payer_plan_period_start_date: string
    payer_plan_period_end_date: string
    payer_concept_id?: number
    payer_source_value?: string
    payer_source_concept_id?: number
    plan_concept_id?: number
    plan_source_value?: number
    plan_source_concept_id?: number
    sponsor_concept_id?: number
    sponsor_source_value?: string
    sponsor_source_concept_id?: number
    family_source_value?: string
    stop_reason_concept_id?: number
    stop_reason_source_value?: string
    stop_reason_source_concept_id?: number
}
```

### cost
```
interface cost {
    cost_id: number
    cost_event_id: number
    cost_domain_id: string
    cost_type_concept_id: number
    currency_concept_id?: number
    total_charge?: number
    total_cost?: number
    total_paid?: number
    paid_by_payer?: number
    paid_by_patient?: number
    paid_patient_copay?: number
    paid_patient_coinsurance?: number
    paid_patient_deductible?: number
    paid_by_primary?: number
    paid_ingridient_cost?: string
    paid_dispensing_fee?: number
    payer_plan_period_id?: number
    amount_allowed?: number
    revenue_code_concept_id?: number
    revenue_code_source_value?: string
    drg_concept_id?: number
    drg_source_value?: string
}
```

### drug_era
```
interface drug_era {
    drug_era_id: number
    person_id: number
    drug_concept_id: number
    drug_era_start_date: string
    drug_era_end_date: string
    drug_exposure_count?: number
    gap_days?: number
}
```

### dose_era
```
interface dose_era {
    dose_era_id: number
    person_id: number
    drug_concept_id: number
    unit_concept_id: number
    dose_value: number
    dose_era_start_date: string
    dose_era_end_date: string
}
```

### condition_era
```
interface condition_era {
    condition_era_id: number
    person_id: number
    condition_concept_id: number
    condition_era_start_date: string
    condition_era_end_date: string
    condition_occurence_count: number
}
```

### episode (v6)
```
interface episode {
    episode_id: number
    person_id: number
    episode_concept_id: number
    episode_start_date: string
    episode_start_datetime?: string
    episode_end_date?: string
    episode_end_datetime?: string
    episode_parent_id?: number
    episode_number?: number
    episode_object_concept_id?: number
    episode_type_concept_id?: number
    episode_source_value?: string
    episode_source_concept_id?: number
}
```

### episode_event (v6)
```
interface episode_event {
    episode_id: number
    event_id: number
    episode_event_field_concept_id: number
}
```

### metadata
```
interface metadata {
    metadata_id: number
    metadata_concept_id: number
    metadata_type_concept_id: number
    name: string
    value_as_string?: string
    value_as_concept_id?: number
    value_as_number?: number
    metadata_date?: string
    metadata_datetime?: string
}
```

### cdm_source
```
interface cdm_source {
    cdm_source_name: string
    cdm_source_abbrevation: string
    cdm_holder: string
    source_description?: string
    source_documentation_reference?: string
    cdm_etl_reference?: string
    source_release_date?: string
    cdm_release_date?: string
    cdm_version?: string
    cdm_version_concept_id?: string
}
```

### concept
```
interface concept {
    concept_id: number
    concept_name: string
    domain_id: string
    vocabulary_id: string
    concept_class_id: string
    standard_concept?: string
    concept_code: string
    valid_start_date: string
    valid_end_date: string
    invalid_reason: boolean
}
```

### vocabulary
```
interface vocabulary {
    vocabulary_id: string
    vocabulary_name: string
    vocabulary_reference?: string
    vocabulary_version?: string
    vocabulary_concept_id: string
}
```

### domain
```
interface domain {
    domain_id: string
    domain_name: string
    domain_concept_id: number
}
```

### concept_class
```
interface concept_class {
    concept_class_id: string
    concept_class_name: string
    concept_class_concept_id: number
}
```

### concept_relationship
```
interface concept_relationship {
    concept_id_1: number
    concept_id_2: number
    relationship_id: string
    valid_start_date: string
    valid_end_date: string
    invalid_reason: boolean
}
```

### relationship
```
interface relationship {
    relationship_id: string
    relationship_name: string
    is_heararchical: boolean
    defines_anchestry: boolean
    reverse_relationship_id: string
    relationship_concept_id: string
}
```

### concept_synonym
```
interface concept_synonym {
    concept_id: number
    concept_synonym_name: string
    language_concept_id: number
}
```

### concept_anchestor
```
interface concept_anchestor {
    anchestor_concept_id: number
    descendant_concept_id: number
    min_levels_of_separation: number
    max_levels_of_separation: number
}
```

### source_to_concept_map
```
interface source_to_concept_map {
    source_code: string
    source_concept_id: number
    source_vocabulary_id: string
    source_code_description: string
    target_concept_id: number
    target_vocabulary_id: string
    valid_start_date: string
    valid_end_date: string
    invalid_reason: boolean
}
```

### drug_strength
```
interface drug_strength {
    drug_concept_id: number
    ingredient_concept_id: number
    amount_value?: number
    amount_unit_concept_id?: number
    numerator_value?: number
    numerator_unit_concept_id?: number
    denominator_value?: number
    denominator_unit_concept_id?: number
    box_size?: number
    valid_start_date: string
    valid_end_date: string
    invalid_reason?: boolean
}
```

### cohort
```
interface cohort {
    cohort_definition_id: number
    subject_id: number // refers to person_id, provider_id etc
    cohort_start_date: string
    cohort_end_date: string
}
```

### cohort_definition
```
interface cohort_definition {
    cohort_definition_id: number
    cohort_definition_name: string
    cohort_definition_description?: string
    definition_type_concept_id: number
    cohort_definition_syntax?: string
    subject_concept_id: number
    cohort_initiation_date?: string
}
```

# understanding
### claude : what's the difference between visit_occurence and visit_detail?

**`visit_occurrence`** represents the **top-level, administrative view of a visit** — e.g. a single inpatient admission from check-in to discharge. **`visit_detail`** captures the **granular movements within that visit** — ward transfers, ICU stays, individual consultations, or daily encounters that happen under the same admission umbrella. For example, a 5-day inpatient stay is one `visit_occurrence`, but the patient's movement through ER → ICU → general ward would be three `visit_detail` rows all linked back to that single parent via `visit_occurrence_id`. The apparent redundancy — both tables sharing fields like `visit_concept_id`, `admitting_source_concept_id`, `discharge_to_concept_id` etc. — is intentional, because each level of care has its own start/end, admit source, and discharge destination that are independently meaningful. A patient can be discharged from the ICU to a general ward (`visit_detail` level) while still being under the same hospital admission (`visit_occurrence` level). Not all OMOP implementations populate `visit_detail`, and it's considered optional — most claims-based datasets only have enough information to populate `visit_occurrence`, while EHR-based datasets with rich encounter-level data are more likely to leverage `visit_detail` for the full granularity.

### claude: drug_exposure details

**`refills`**
The **number of refills authorized beyond the original fill**. So `refills = 3` means the original dispensing + 3 more fills are allowed — 4 total supplies. This comes typically from pharmacy claims or prescription records. It's often poorly populated in EHR data because the refill authorization lives in the prescription system, not the clinical notes.

---

**`quantity`**
The **amount of drug dispensed** in that exposure event — e.g. `90` for 90 tablets. Notably, it has no unit attached to it in the field itself — the unit is implied by the drug concept or captured separately in `dose_unit_source_value`. This ambiguity is a known weakness; `quantity = 30` could mean 30 tablets, 30ml, or 30 patches depending on the drug.

---

**`sig`**
Short for _signa_ — Latin for "instructions." This is the **free-text prescription instruction** as written by the prescriber, e.g. `"Take 1 tablet by mouth twice daily with food"`. It's essentially a passthrough field from the source — unstructured and not standardized. Useful for reference or NLP downstream, but not meant for structured querying.

---

**`route_concept_id`**
How the drug **enters the body**, mapped to a standard concept:

|Concept ID|Route|
|---|---|
|`4132161`|Oral|
|`4171047`|Intravenous|
|`4157760`|Subcutaneous|
|`4303112`|Topical|
|`4186834`|Inhalation|
|`4262099`|Intramuscular|

Note that route is sometimes already **embedded in the drug concept itself** (e.g. "Aspirin 81mg oral tablet") — so `route_concept_id` can be redundant in those cases, but is still useful when the drug concept is generic and route varies.

---

**`lot_number`**
The **manufacturer's batch/lot identifier** for the specific drug product dispensed. Primarily useful for **pharmacovigilance and drug recall scenarios** — if a lot is found to be contaminated or defective, you can trace exactly which patients received it. Rarely populated outside of dispensing systems or vaccine administration records (where lot tracking is regulatory requirement).

---

**`provider_id`**
The **prescriber or administering clinician** associated with the exposure — links to the `provider` table. Interpretation depends on context:

- For outpatient prescriptions → the prescribing physician
- For inpatient drug administrations → could be the ordering or administering provider

Often inconsistently populated, and the semantics (prescriber vs. administrator) vary by source system and ETL decision.

---

**`drug_source_concept_id` vs `drug_concept_id`**
Same source-vs-standard pattern you've seen elsewhere:

```
drug_source_value        ← raw code from source ("00071-0155-23", "metformin 500mg")
drug_source_concept_id   ← OMOP concept directly matching that raw code (e.g. NDC concept)
drug_concept_id          ← standardized concept after mapping (e.g. RxNorm)
```

The typical mapping chain is:

```
NDC (dispensing) ──→ RxNorm Clinical Drug ──→ RxNorm Ingredient
      source              standard                  ancestor
```

This is important because analyses usually roll up to the **ingredient level** (e.g. "all metformin exposures") using `CONCEPT_ANCESTOR`, regardless of what brand, dose, or form was dispensed.

---

**`dose_unit_source_value`**
The **unit for the dose as it appeared in the source system** — e.g. `"mg"`, `"mcg"`, `"mL"`. This is a source passthrough (note it's `_source_value`, not a concept ID), meaning OMOP doesn't have a standardized `dose_unit_concept_id` field in the current CDM — a known gap. The actual dose amount itself isn't a standalone field either; it's typically embedded in the drug concept (e.g. "Metformin 500 MG Oral Tablet") rather than stored as a discrete value, which makes cross-drug dose comparisons tricky without parsing the concept name or using the `DRUG_STRENGTH` vocabulary table.

---

**The big picture for `drug_exposure`:**
```
WHAT drug    → drug_concept_id (standardized via RxNorm)
HOW MUCH     → quantity + dose_unit_source_value (weakly structured)
HOW          → route_concept_id
HOW LONG     → drug_exposure_start_date + drug_exposure_end_date + days_supply
HOW MANY     → refills
INSTRUCTIONS → sig (free text)
WHO gave it  → provider_id
WHICH batch  → lot_number
RAW SOURCE   → drug_source_value + drug_source_concept_id
```

The weakest area is dosage — quantity, dose amount, and units are fragmented across fields and often source-dependent, making dose-level analysis one of the harder problems in OMOP-based research.

### claude: device_exposure - full picture

```
WHAT device      → device_concept_id (SNOMED/HCPCS)
WHEN applied     → device_exposure_start_date
WHEN removed     → device_exposure_end_date (often NULL)
HOW recorded     → device_type_concept_id (provenance)
WHICH unit       → unique_device_identifier (FDA UDI)
WHICH batch      → production_id
HOW MANY         → quantity + unit_concept_id (better structured than drug)
RAW SOURCE       → device_source_value + device_source_concept_id
UNIT SOURCE      → unit_source_value + unit_source_concept_id
```

### claude: what measurement is for
`measurement` is one of the most heavily used tables in OMOP. It captures any **structured, quantifiable clinical observation** — essentially anything that produces a result that can be a number, a coded value, or both. This includes lab results, vital signs, imaging findings, clinical scores, and diagnostic test results. The key distinction from `observation` (which we can cover separately) is that `measurement` implies some form of **test or assessment was performed** and a **result was recorded**.

### claude: what observation is for
`observation` is the **catch-all clinical facts table** — it captures anything clinically meaningful that doesn't fit cleanly into the more structured tables like `measurement`, `condition_occurrence`, or `drug_exposure`. The key distinction from `measurement` is that `observation` doesn't necessarily require a test to be performed or produce a quantifiable result. It covers **subjective findings, social history, clinical assessments, patient-reported information, and contextual facts** about a person. Think of it as the table for "everything else that matters clinically but isn't a diagnosis, drug, procedure, or lab result."

Common examples of what lands in `observation`:

- Smoking status, alcohol use, occupation
- Family history of disease
- Pregnancy status
- Allergy severity or criticality
- Clinical survey responses (PHQ-9 depression score)
- Absence of findings ("No family history of cancer")
- Patient preferences or advance directives

### claude: what is concept table for
The `concept` table is the **backbone of the entire OMOP vocabulary system** — it's the universal dictionary that every other table references through `_concept_id` fields. Every coded clinical entity in OMOP — every drug, diagnosis, procedure, unit, route, observation, visit type, and more — has a row in `concept`. When you store `gender_concept_id = 8507` in the `person` table, you're pointing to a row in `concept` that says "Male." It's not just a lookup table though — it's a richly structured terminology system that encodes relationships between vocabularies, domains, and concept hierarchies across the entire clinical knowledge space.