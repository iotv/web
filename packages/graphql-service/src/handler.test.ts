import {handleGraphQL} from './handler'

describe('handler', () => {
  it('should test nothing', async () => {
    const result = await handleGraphQL({}, {})
    expect(result).toEqual({})
  })
})
