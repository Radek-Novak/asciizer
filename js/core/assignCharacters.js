const assignCharacters =
  (counts, chars) => counts.map(
    val => Array.isArray(chars) ? chars[Math.floor(val)] : chars.charAt(Math.floor(val))
  )

module.exports = assignCharacters
