/* eslint-disable @typescript-eslint/no-non-null-assertion */
import fetch from 'node-fetch'
import { URLSearchParams } from 'url'
import { clearInterval, setInterval } from 'timers'

const URL = 'https://store.steampowered.com/events/ajaxgetpartnereventspageable/?'

// No idea how to remove this magic numbers
const TYPE_IDS = {
  updates: 12,
  blog: 14
}

const INITIAL_FETCH_PARAMS = {
  l: 'english',
  clan_accountid: 0,
  appid: 730,
  offset: 0,
  count: 100,
  origin: 'https://www.counter-strike.net'
}

/**
 * Uses this url: "https://www.counter-strike.net/news/"
 * @returns {Promise<Post[]>}
 * @param params
 * @param postsFilter
 */
export async function getBlogPosts (params?: Partial<CSGOFetchParams>, postsFilter?: CSGOPostFilter): Promise<Post[]> {
  return await getPosts(TYPE_IDS.blog, params, postsFilter)
}

/**
 * Uses this url: https://www.counter-strike.net/news/updates/
 * @returns {Promise<Post[]>}
 * @param params
 * @param postsFilter
 */
export async function getUpdatePosts (params?: Partial<CSGOFetchParams>, postsFilter?: CSGOPostFilter): Promise<Post[]> {
  return await getPosts(TYPE_IDS.updates, params, postsFilter)
}

function filterPost (postsFilter: CSGOPostFilter, post: any, recursionDepth = 1): boolean {
  if (recursionDepth > 5) {
    return false
  }
  return Object.keys(postsFilter).every(key => (
    typeof post === 'object' &&
    (typeof postsFilter[key] === 'object'
      ? filterPost(postsFilter[key], post[key], recursionDepth + 1)
      : postsFilter[key] === post[key]
    )
  ))
}

/**
 *
 * @returns {Promise<Post[]>}
 * @param category
 * @param params
 * @param postsFilter
 */
export default async function getPosts (category?: number, params?: Partial<CSGOFetchParams>, postsFilter: CSGOPostFilter = {}): Promise<Post[]> {
  const res = await fetch(URL + new URLSearchParams({ ...INITIAL_FETCH_PARAMS, ...params } as unknown as Record<string, string>).toString(), {
    headers: {
      Accept: 'application/json'
    }
  })
  const data = await res.json()
  return data.events.filter((post: any) => (!category || post.event_type === category) && filterPost(postsFilter, post)).map((post: any) => {
    const image: string | undefined = JSON.parse(post.jsondata ?? '{}').localized_capsule_image[0]
    return {
      title: post.announcement_body.headline,
      content: post.announcement_body.body,
      date: new Date(post.announcement_body.posttime * 1000),
      link: 'https://www.counter-strike.net/newsentry/' + String(post.gid),
      ...(image && { image: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/clans/3381077/' + image })
    }
  })
}

export interface CSGOFetchParams {
  l: 'english' | string
  clan_accountid: 0 | number
  appid: 730 | number
  offset: 0 | number
  count: 100 | number
  origin: 'https://www.counter-strike.net' | string
}

export interface CSGOPostFilter {
  [key: string]: any
}

export interface Post {
  title: string
  link: string
  date: Date
  image?: string
  content: string
}

export class UpdatesListener {
  private readonly intervalId: NodeJS.Timer
  private readonly params?: Partial<CSGOFetchParams>
  private readonly postsFilter: CSGOPostFilter
  private readonly callback: (post: Post) => any
  private readonly callbackError?: (e: unknown) => any
  private lastPostTime: number
  constructor (callback: (post: Post) => any, interval: number = 600000, params?: Partial<CSGOFetchParams>, lastPostTime?: number, callbackError?: (e: unknown) => any, postsFilter: CSGOPostFilter = {}) {
    this.lastPostTime = lastPostTime ?? Date.now()
    this.params = params
    this.callback = callback
    this.callbackError = callbackError
    this.postsFilter = postsFilter
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.intervalId = setInterval(this.fetchPosts.bind(this), interval)
    void this.fetchPosts()
  }

  async fetchPosts (): Promise<void> {
    try {
      const posts = await getPosts(undefined, this.params, this.postsFilter)
      posts.reverse().forEach(post => {
        if (post.date.getTime() <= this.lastPostTime) {
          return
        }
        this.callback(post)
        this.lastPostTime = post.date.getTime()
      })
    } catch (e) {
      if (this.callbackError) {
        try {
          this.callbackError(e)
        } catch (e) {}
      }
    }
  }

  stopListening (): void {
    clearInterval(this.intervalId)
  }
}
