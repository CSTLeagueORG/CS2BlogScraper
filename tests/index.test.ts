import { getBlogPosts, getUpdatePosts } from '../src/index'

describe('getBlogPosts', () => {
  it('should return an array of posts', async () => {
    const posts = await getBlogPosts()
    expect(posts).toBeInstanceOf(Array)
  })

  it('should return an array of ukrainian posts', async () => {
    const posts = await getBlogPosts({ l: 'ukrainian' }, { announcement_body: { language: 26 } })
    expect(posts).toBeInstanceOf(Array)
  })

  it('should return an array of russian posts', async () => {
    const posts = await getBlogPosts({ l: 'russian' }, { announcement_body: { language: 8 } })
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
    const posts = await getUpdatePosts({ l: 'ukrainian' }, { announcement_body: { language: 26 } })
    expect(posts).toBeInstanceOf(Array)
  })

  it('should throw an error', async () => {
    await expect(getUpdatePosts({ offset: 10000 })).rejects.toThrow()
  })
})
