---
title: Schema
---
### Standardized clinical data
Describes clinical data records 

person
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