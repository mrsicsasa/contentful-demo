import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function RecipeCard({ recipe, preview }) {
  const { title, slug, cookingTime, thumbnail, tags } = recipe.fields;
  const isDraft = preview && !recipe.sys.publishedAt;

  return (
    <div className="card">

      {isDraft && <div className="preview-badge">Draft</div>}

      <div className="featured">
        <Image
          src={'https:' + thumbnail.fields.file.url}
          width={thumbnail.fields.file.details.image.width}
          height={thumbnail.fields.file.details.image.height}
          alt={title}
        />
      </div>

      <div className="content">
        <div className="info">
          <h4>{title}</h4>
          <p>Takes approx {cookingTime} mins to make</p>

          {/* Tags */}
          <div className="tags">
            {tags?.map(tag => (
              <span key={tag.sys.id}>{tag.fields.title}</span>
            ))}
          </div>
        </div>

        <div className="actions">
          <Link href={'/recipes/' + slug} className="action-link">
            Cook this
          </Link>
        </div>
      </div>

      <style jsx>{`
        .card {
          position: relative;
          transform: rotateZ(-1deg);
        }
        .preview-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #f01b29;
          color: #fff;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: bold;
        }
        .content {
          background: #fff;
          box-shadow: 1px 3px 5px rgba(0,0,0,0.1);
          margin: 0;
          position: relative;
          top: -40px;
          left: -10px;
        }
        .info { padding: 16px; }
        .info h4 { margin: 4px 0; text-transform: uppercase; }
        .info p { margin: 0; color: #777; }
        .tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: 8px;
        }
        .tags span {
          background: #eee;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
        .actions { margin-top: 20px; display: flex; justify-content: flex-end; }
        :global(.action-link) {
          color: #fff;
          background: #f01b29;
          padding: 16px 24px;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
