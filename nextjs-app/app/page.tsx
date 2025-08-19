import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Next.js Main Site (nx.dev)</h1>
        <p>This represents the main nx.dev website hosted on Vercel</p>
        
        <div className={styles.ctas}>
          <Link href="/docs" className={styles.primary}>
            Go to Documentation
          </Link>
          <Link href="/docs/getting-started" className={styles.secondary}>
            Getting Started Guide
          </Link>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <h2>Test Links</h2>
          <ul>
            <li><Link href="/">Home (Next.js)</Link></li>
            <li><Link href="/docs">Docs Home (Astro)</Link></li>
            <li><Link href="/docs/getting-started">Getting Started (Astro)</Link></li>
            <li><Link href="/docs/guides/installation">Installation Guide (Astro)</Link></li>
          </ul>
        </div>
      </main>
    </div>
  );
}
