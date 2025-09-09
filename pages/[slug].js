import { createClient } from "contentful"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY,
})

export async function getStaticPaths() {
  const res = await client.getEntries({ content_type: "navigationItem" })

  const paths = res.items.map(item => ({
    params: { slug: item.fields.slug }
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const res = await client.getEntries({
    content_type: "navigationItem",
    "fields.slug": params.slug
  })

  return {
    props: {
      page: res.items[0] || null
    }
  }
}

export default function Page({ page }) {
  if (!page) return <p>Not found</p>

  const { label, content } = page.fields

  return (
    <div>
      <h1>{label}</h1>
      <div>{documentToReactComponents(content)}</div>
    </div>
  )
}
