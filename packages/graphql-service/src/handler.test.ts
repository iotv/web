import {handleGraphQL} from './handler'

describe('handler', () => {
  it('should test nothing', async () => {
    const result = await handleGraphQL(
      {body: '{"query": "mutation {applyForBeta(email: \\"d@d.com\\")}"}'},
      {},
    )
    expect(result).toEqual({})
  })
})
