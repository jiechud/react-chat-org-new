const fakeData = require('../utils/fake-data')
const { init } = require('../chart')
const { children } = fakeData()

console.log('children', children)

init({ id: '#root', data: { children }, lineType: 'angle' })
