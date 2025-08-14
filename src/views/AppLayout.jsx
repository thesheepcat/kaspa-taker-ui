import { Outlet } from "react-router-dom";
import styles from "./AppLayout.module.css";

const AppLayout = () => {
  return (
    <>
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
};

export default AppLayout;
