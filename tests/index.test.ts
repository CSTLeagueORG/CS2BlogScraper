import { getBlogPosts, getUpdatePosts } from '../src/index'

describe('getBlogPosts', () => {
  it('should return an array of posts', async () => {
    const posts = await getBlogPosts()
    expect(posts).toBeInstanceOf(Array)
  })

  it('should return an array of ukrainian posts', async () => {
    const posts = await getBlogPosts()
    expect(posts).toBeInstanceOf(Array)
  })

  it('should throw an error', async () => {
    await expect(getBlogPosts({ offset: 10000 })).rejects.toThrow()
  })
})

describe('getUpdatePosts', () => {
  it('should return an array of posts', async () => {
    const posts = await getUpdatePosts()
    expect(posts).toBeInstanceOf(Array)
  })
  it('should return an array of ukrainian posts', async () => {
    const posts = await getUpdatePosts({ l: 'ukrainian' })
    expect(posts).toBeInstanceOf(Array)
  })

  it('should throw an error', async () => {
    await expect(getUpdatePosts({ offset: 10000 })).rejects.toThrow()
  })
})
