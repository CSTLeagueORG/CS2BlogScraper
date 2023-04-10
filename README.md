# CS Blog and Updates Scraper
Get Blog and Update posts from CS2
### Usage:
```ts
import { getBlogPosts, getUpdatePosts } from "@cstleagueorg/cs2-blog-scraper";

const blogPosts = await getBlogPosts();
const updatePosts = await getUpdatePosts();
```
OR
```ts
import getPosts from "@cstleagueorg/cs2-blog-scraper";

const posts = await getPosts();
```
OR
```ts
import { UpdatesListener, Post } from "@cstleagueorg/cs2-blog-scraper";
function receiveUpdate(post: Post) {
  console.log(post)
}
const listener = new UpdatesListener(receiveUpdate); // check updates every 10 minutes
...
listener.stopListening();
```
### Output:
```ts
interface Post {
  title: string;
  url: string;
  date: Date;
  image?: string;
  content: string;
}
```
