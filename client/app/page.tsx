'use client'
import { GithubUserProvider, GitlabUserProvider } from "./context/userContext";
import styles from "./page.module.css";
import Gitlab from "./components/Gitlab";
import Github from "./components/Github";
import Data from "./components/Data";
import github from "../public/github-cropped.svg";
import Image from 'next/image'

export default function Home() {

  return (
    <GitlabUserProvider>
      <GithubUserProvider>
        <main className={styles.main}>
          <div className={styles.linkContainer}>
            <a href="https://github.com/antarpreet11/Gitlab-Contributions-Sync" className={styles.githubLink} target="_blank">
              <Image src={github}
                width={50}
                height={50}
                alt="Github"/>
                <div className={styles.linkText}>Source code </div>
            </a> 
          </div>
          <div className={styles.mainDiv}>
            <Gitlab></Gitlab>
            <Data></Data>
            <Github></Github>
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
