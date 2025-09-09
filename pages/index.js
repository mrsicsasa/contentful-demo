import { createClient } from 'contentful'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import RecipeCard from '../components/RecipeCard'
import CategoryFilter from '../components/CategoryFilter'
import TagFilter from '../components/TagFilter'

export async function getStaticProps({ preview = false }) {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: preview ? process.env.CONTENTFUL_PREVIEW_ACCESS_KEY : process.env.CONTENTFUL_ACCESS_KEY,
    host: preview ? 'preview.contentful.com' : 'cdn.contentful.com',
  })

  const [recipesRes, categoriesRes, tagsRes] = await Promise.all([
    client.getEntries({ content_type: 'recipe', limit: 1000 }),
    client.getEntries({ content_type: 'category', limit: 1000 }),
    client.getEntries({ content_type: 'tags', limit: 1000 }),
  ])

  return {
    props: {
      recipes: recipesRes.items || [],
      categories: categoriesRes.items || [],
      tags: tagsRes.items || [],
      preview,
    },
    revalidate: 60,
  }
}

export default function Recipes({ recipes, categories, tags, preview }) {
  const router = useRouter()
  const initialCategory = typeof router.query.category === 'string' ? router.query.category : 'all'
  const initialTags = Array.isArray(router.query.tags) ? router.query.tags : []
  const initialSort = typeof router.query.sort === 'string' ? router.query.sort : 'newest'

  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedTags, setSelectedTags] = useState(initialTags)
  const [sortOption, setSortOption] = useState(initialSort)

  useEffect(() => {
    const query = {}
    if (selectedCategory && selectedCategory !== 'all') query.category = selectedCategory
    if (selectedTags.length > 0) query.tags = selectedTags
    if (sortOption && sortOption !== 'newest') query.sort = sortOption
    router.replace({ pathname: '/', query }, undefined, { shallow: true })
  }, [selectedCategory, selectedTags, sortOption])

  const filtered = recipes.filter(recipe => {
    const cat = recipe.fields?.category
    const recipeTags = recipe.fields?.tags || []
    
    if (selectedCategory !== 'all') {
      const slug = cat?.fields?.slug ?? cat?.sys?.id
      if (slug !== selectedCategory) return false
    }

    if (selectedTags.length > 0) {
      const recipeTagSlugs = recipeTags.map(t => t.fields.slug)
      return selectedTags.every(t => recipeTagSlugs.includes(t))
    }

    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    switch(sortOption) {
      case 'cookingTimeAsc':
        return a.fields.cookingTime - b.fields.cookingTime
      case 'cookingTimeDesc':
        return b.fields.cookingTime - a.fields.cookingTime
      case 'newest':
      default:
        return new Date(b.sys.createdAt) - new Date(a.sys.createdAt)
    }
  })

  return (
    <div>
      {preview && <div className="preview-banner">Preview Mode - Draft Recipes</div>}

      {/* Ikonica za toggle preview */}
      <div className="preview-toggle">
        {preview ? (
          <Link href="/api/exit-preview" className="toggle-link" title="Exit preview mode">
            🚪 Exit
          </Link>
        ) : (
          <Link href="/api/preview" className="toggle-link" title="Enter preview mode">
            👁️ Preview
          </Link>
        )}
      </div>

      <div className="controls">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <TagFilter
          tags={tags}
          selectedTags={selectedTags}
          onSelect={setSelectedTags}
        />

        <div className="sort">
          <label htmlFor="sort-select">Sort by: </label>
          <select
            id="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="cookingTimeAsc">Cooking time: shortest first</option>
            <option value="cookingTimeDesc">Cooking time: longest first</option>
          </select>
        </div>
      </div>

      <div className="recipe-list">
        {sorted.map(recipe => (
          <RecipeCard key={recipe.sys.id} recipe={recipe} preview={preview} />
        ))}
      </div>

      <style jsx>{`
        .preview-banner {
          background: #f01b29;
          color: #fff;
          padding: 10px;
          text-align: center;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .preview-toggle {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 10px;
        }
        .toggle-link {
          background: #eee;
          padding: 6px 12px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 14px;
        }
        .toggle-link:hover {
          background: #ddd;
        }
        .controls {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 20px;
        }
        .sort {
          margin-top: 10px;
        }
        .recipe-list {
          display:grid;
          grid-template-columns: repeat(auto-fit, minmax(320px,1fr));
          gap: 20px 40px;
        }
      `}</style>
    </div>
  )
}
