import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from 'contentful'

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_KEY,
  host: 'cdn.contentful.com',
})


export default function Layout({ children }) {
  const [navItems, setNavItems] = useState([])

  useEffect(() => {
    async function fetchNav() {
      const res = await client.getEntries({ content_type: 'navigationItem', order: 'fields.order' })
      setNavItems(res.items || [])
    }
    fetchNav()
  }, [])

  return (
    <div className="layout">
      
      <header>
        <div className="logo">
          <Link href="/">
            <h1>
              <span>ContentFul</span> <span>Demo</span>
            </h1>
            <h2>Food</h2>
          </Link>
        </div>

        <nav>
          <ul>
            {navItems.map(item => (
              <li key={item.sys.id}>
                <Link href={`/${item.fields.slug}`} className="nav-link">
                  {item.fields.label}
                </Link>
                {item.fields.children && item.fields.children.length > 0 && (
                  <ul className="submenu">
                    {item.fields.children.map(child => (
                      <li key={child.sys.id}>
                        <Link href={`/${child.fields.slug}`} className="submenu-link">
                          {child.fields.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="page-content">{children}</main>

      <footer>
        <p>Copyright 2025 ContentFul Demo</p>
      </footer>

      <style jsx>{`
        /* HEADER & LOGO */
        header {
          display: flex;
           flex-direction: column;
          padding: 20px 40px;
          background: #fff  ;
          color: #fff;
        }
        .logo h1 {
          margin: 0;
          font-size: 1.8rem;
          font-weight: bold;
        }
        .logo h2 {
          margin: 0;
          font-size: 1rem;
          font-weight: 400;
        }
        .logo a {
          text-decoration: none;
          color: #fff;
        }

        /* NAVIGATION */
        nav ul {
          display: flex;
          gap: 24px;
          list-style: none;
          margin: 16px 0 0 0;
          padding: 0;
        }
        nav li {
          position: relative;
        }
        .nav-link {
          text-decoration: none;
          color: #fff;
          font-weight: 500;
          padding: 6px 0;
          transition: color 0.3s;
        }
        .nav-link:hover {
          color: #ffe600;
        }

        /* SUBMENU */
        .submenu {
          display: none;
          position: absolute;
          top: 36px;
          left: 0;
          background: #fff;
          color: #000;
          list-style: none;
          padding: 10px 0;
          min-width: 160px;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: opacity 0.3s;
          z-index: 10;
        }
        li:hover .submenu {
          display: block;
        }
        .submenu li {
          padding: 0;
        }
        .submenu-link {
          display: block;
          padding: 8px 16px;
          text-decoration: none;
          color: #333;
          transition: background 0.2s;
        }
        .submenu-link:hover {
          background: #f01b29;
          color: #fff;
        }

        /* PAGE CONTENT */
        .page-content {
          padding: 0px 40px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* FOOTER */
        footer {
          padding: 20px 40px;
          text-align: center;
          background: #222;
          color: #fff;
        }
      `}</style>
    </div>
  )
}
