'use strict'

const a = Promise.resolve(4).then(b => {
  return Promise.resolve(6)
})

console.log(a)
const b = function (a, c) {
  const e = Error('shit')
  return c(e, 2)
}

b(a, (err, data) => {
  console.log(err, data)
})
module.exports = {
  eslint: require('./eslintrc')
}
