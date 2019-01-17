const { expect } = require('chai')

describe(function () {
  before(function () {})
  it('something', () => {
    it('should be shit')
  })
  it('should not work alone', done => {
    var a = this
    for (const i in [2, 3, 4]) {
      console.log(i)
    }
    expect(2).to.be.ok()
  })
})
