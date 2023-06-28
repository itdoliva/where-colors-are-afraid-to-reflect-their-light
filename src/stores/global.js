import { readable, writable, derived } from "svelte/store"
import { scaleLinear, extent } from 'd3'

export const data = writable([])

export const continents = readable(['c2', 'c5', 'c4', 'c3', 'c1', 'c0'])

export const colors = readable({
  'c2': '#E85959',
  'c5': '#F48E57',
  'c4': '#F3C870',
  'c3': '#89AE89',
  'c1': '#3D80A7',
  'c0': '#8E63B9',
})


export const emphasized = writable(false)

export const scales = derived([data, colors, emphasized], ([$data, $colors, $emphasized]) => {
  const domain = extent($data, d => d.score)
  
  const scales = {}
  Object.entries($colors).forEach(d => {
    const [ continentId, hex ] = d
    
    if ($emphasized) {
      scales[continentId] = scaleLinear()
        .domain([domain[0], 0, domain[1]])
        .range(['#5C5C5C', 'darkgrey', hex])
    } else {
      scales[continentId] = scaleLinear()
        .domain(domain)
        .range(['#5C5C5C', hex])
    }
  })

  return scales
})


export const categories = readable([
  { id: 'cat1', range: [0, 3], },
  { id: 'cat2', range: [-1, 2], },
  { id: 'cat3', range: [-1, 3], },
  { id: 'cat4', range: [-1, 3], },
  { id: 'cat5', range: [-1, 2], },
  { id: 'cat6', range: [-1, 1], },
  { id: 'cat7', range: [-1, 1], },
  { id: 'cat8', range: [0, 2], },
  { id: 'cat9', range: [-2, 0], },
  { id: 'cat10', range: [-1, 0], },
  { id: 'cat11', range: [-2, 0], },
  { id: 'cat12', range: [-1, 0], },
  { id: 'cat13', range: [-1, 1], },
  { id: 'cat14', range: [-2, 1], },
  { id: 'cat15', range: [-2, 0], },
  { id: 'cat16', range: [-2, 0], },
  { id: 'cat17', range: [-5, 0], },
])
