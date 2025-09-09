import React from 'react';

export default function TagFilter({ tags = [], selectedTags = [], onSelect }) {
  const toggleTag = (slug) => {
    if (selectedTags.includes(slug)) {
      onSelect(selectedTags.filter(t => t !== slug));
    } else {
      onSelect([...selectedTags, slug]);
    }
  }

  return (
    <div className="tag-filter">
      <span className="label">Tags:</span>
      {tags.map(tag => (
        <button
          key={tag.sys.id}
          className={`tag-button ${selectedTags.includes(tag.fields.slug) ? 'active' : ''}`}
          onClick={() => toggleTag(tag.fields.slug)}
        >
          {tag.fields.title}
        </button>
      ))}

      <style jsx>{`
        .tag-filter {
          display:flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          margin-top: 10px;
        }
        .label {
          font-weight: bold;
          margin-right: 8px;
          color: #555;
        }
        .tag-button {
          border: 1px solid #ccc;
          background: #fff;
          padding: 6px 12px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 13px;
        }
        .tag-button:hover {
          background: #f9f9f9;
          border-color: #aaa;
        }
        .tag-button.active {
          background: #f01b29;
          color: #fff;
          border-color: #f01b29;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  )
}
