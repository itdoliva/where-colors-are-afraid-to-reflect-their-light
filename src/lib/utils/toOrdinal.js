export function getOrdinalSymbol(num, english) {
  if (english && num === 1) {
    return 'st'
  } else
  if (english && num === 2) {
    return 'nd'
  } else
  if (english && num === 3) {
    return 'rd'
  } else
  if (english) {
    return 'th'
  } else {
    return '°'
  }
}

export function toOrdinal(num, locale, asHTML=true) {
  const english = locale === 'en'
  const symbol = getOrdinalSymbol(num, english)

  return english && asHTML 
    ? `${num}<sup>${symbol}</sup>`
    : num + symbol
}