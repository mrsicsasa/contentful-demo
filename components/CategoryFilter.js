import React from 'react'

export default function CategoryFilter({ categories = [], selected = 'all', onSelect }) {
  return (
    <div className="category-filter">
      <button
        className={selected === 'all' ? 'active' : ''}
        onClick={() => onSelect('all')}
      >
        All
      </button>

      {categories.map(cat => {
        const slug = cat.fields?.slug ?? cat.sys.id
        const title = cat.fields?.title ?? 'Category'
        return (
          <button
            key={cat.sys.id}
            className={selected === slug ? 'active' : ''}
            onClick={() => onSelect(slug)}
          >
            {title}
          </button>
        )
      })}

      <style jsx>{`
        .category-filter {
          display:flex;
          gap:10px;
          flex-wrap:wrap;
        }
        button {
          border: none;
          padding: 8px 12px;
          background: #eee;
          border-radius: 6px;
          cursor: pointer;
        }
        button.active {
          background: #f01b29;
          color: #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.12);
        }
      `}</style>
    </div>
  )
}
