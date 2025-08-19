import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Next.js Main Site (nx.dev)</h1>
        <p>This represents the main nx.dev website hosted on Vercel</p>
        
        <div className={styles.ctas}>
          <a href="/docs" className={styles.primary}>
            Go to Documentation
          </a>
          <a href="/docs/getting-started" className={styles.secondary}>
            Getting Started Guide
          </a>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <h2>Test Links</h2>
          <ul>
            <li><a href="/">Home (Next.js)</a></li>
            <li><a href="/docs">Docs Home (Astro)</a></li>
            <li><a href="/docs/getting-started">Getting Started (Astro)</a></li>
            <li><a href="/docs/guides/installation">Installation Guide (Astro)</a></li>
          </ul>
        </div>
      </main>
    </div>
  );
}
