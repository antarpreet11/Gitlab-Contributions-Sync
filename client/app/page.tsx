import styles from "./page.module.css";
import Gitlab from "./components/Gitlab";
import Github from "./components/Github";
import Data from "./components/Data";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.mainDiv}>
        <Gitlab></Gitlab>
        <Data></Data>
        <Github></Github>
      </div>
      <span>
        *Please note that we do not store any of your data. We only use it to generate the contributions calendar. <br />
        *Please note that we are not affiliated with Gitlab or Github.
      </span>
    </main>
  );
}
