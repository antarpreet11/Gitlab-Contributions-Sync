'use client'
import { GithubUserProvider, GitlabUserProvider } from "./context/userContext";
import styles from "./page.module.css";
import Gitlab from "./components/Gitlab";
import Github from "./components/Github";
import Data from "./components/Data";

export default function Home() {

  return (
    <GitlabUserProvider>
      <GithubUserProvider>
        <main className={styles.main}>
          <div className={styles.mainDiv}>
            <Github></Github>
            <Gitlab></Gitlab>
            <Data></Data>
          </div>
          <span>
            *Please note that we do not store any data. We do however use local storage on your browser. <br />
            *Please note that we are not affiliated with Gitlab or Github.
          </span>
        </main>
      </GithubUserProvider>
    </GitlabUserProvider>
  );
}
