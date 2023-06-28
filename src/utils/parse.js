export default function parse (raw) {
  return raw.map((d, i) => ({
    id: i+1,
    regionId: d.region_id,
    continentId: d.continent_id,
    score: +d.score,
    rankContinent: +d.continent_rank,
    rank: +d.global_rank,
    categories: {
      cat1: +d.antidiscrimination_legislation,
      cat2: +d.marriage_civil_partners,
      cat3: +d.adoption_allowed,
      cat4: +d.transgender_rights,
      cat5: +d.intersex_3rd_option,
      cat6: +d.equal_age_of_consent,
      cat7: +d.conversion_therapy,
      cat8: +d.lgbt_marketing,
      cat9: +d.religious_influence,
      cat10: +d.hiv_travel_restrictions,
      cat11: +d.anti_gay_laws,
      cat12: +d.homossexuality_illegal,
      cat13: +d.pride_banned,
      cat14: +d.locals_hostile,
      cat15: +d.prosecution,
      cat16: +d.murders,
      cat17: +d.death_sentences,
    }
  }))
}