import { createClient } from 'contentful'
import Image from 'next/image'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

export const getStaticPaths = async () => {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  })

  const res = await client.getEntries({ content_type: "recipe" })

  const paths = res.items.map(item => ({
    params: { slug: item.fields.slug }
  }))

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps = async ({ params, preview = false }) => {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: preview
      ? process.env.CONTENTFUL_PREVIEW_ACCESS_KEY
      : process.env.CONTENTFUL_ACCESS_KEY,
    host: preview ? 'preview.contentful.com' : 'cdn.contentful.com',
  })

  const { items } = await client.getEntries({
    content_type: 'recipe',
    'fields.slug': params.slug,
  })

  return {
    props: {
      recipe: items[0] || null,
      preview,
    },
    revalidate: 60,
  }
}

export default function RecipeDetails({ recipe, preview }) {
  const { featuredImage, title, cookingTime, ingredients, method } = recipe.fields

  return (
    <div>
      {preview && <div className="preview-banner">Preview Mode - Draft Content</div>}

      <div className="banner">
        <Image 
          src={'https:' + featuredImage.fields.file.url}
          width={featuredImage.fields.file.details.image.width}
          height={featuredImage.fields.file.details.image.height}
        />
        <h2>{ title }</h2>
      </div>

      <div className="info">
        <p>Takes about { cookingTime } mins to cook.</p>
        <h3>Ingredients:</h3>
        {ingredients.map(ing => (
          <span key={ing}>{ ing }</span>
        ))}
      </div>
        
      <div className="method">
        <h3>Method:</h3>
        <div>{documentToReactComponents(method)}</div>
      </div>

      <style jsx>{`
        .preview-banner {
          background: #f01b29;
          color: #fff;
          padding: 10px;
          text-align: center;
          font-weight: bold;
        }
        h2,h3 {
          text-transform: uppercase;
        }
        .banner h2 {
          margin: 0;
          background: #fff;
          display: inline-block;
          padding: 20px;
          position: relative;
          top: -60px;
          left: -10px;
          transform: rotateZ(-1deg);
          box-shadow: 1px 3px 5px rgba(0,0,0,0.1);
        }
        .info p {
          margin: 0;
        }
        .info span::after {
          content: ", ";
        }
        .info span:last-child::after {
          content: ".";
        }
      `}</style>
    </div>
  )
}
