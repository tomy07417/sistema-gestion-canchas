import React from "react";
import { ErrorContainer } from "@/components/form-components/ErrorContainer/ErrorContainer";
import { useFormContext } from "@/config/form-context";
import styles from "./FormContainer.module.css";

export const FormContainer = ({ extraError, children }: React.PropsWithChildren<{ extraError: Error | null }>) => {
    const form = useFormContext();

    return (
        <form
            className={styles.form}
            onSubmit={(e) => {
                e.stopPropagation();
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            {children}
            {extraError && <ErrorContainer errors={[extraError]} />}

        </form>
    );
};
