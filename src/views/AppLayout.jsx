import { Outlet } from "react-router-dom";
import styles from "./AppLayout.module.css";
import React from "react";

const AppLayout = () => {
    return(
        <>
            <main className={styles.main}>
                <Outlet/>
            </main>
        </>
    );
};

export default AppLayout;
