import { useFormContext } from "@/config/form-context";
import styles from "./SubmitButton.module.css";
import React from "react";

type Props = {
    className?: string;
    children?: React.ReactNode;
};

export const SubmitButton = ({ className = "", children }: Props) => {
    const form = useFormContext();

    return (
        <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
                <button
                    type="submit"
                    className={`${styles.button} ${className}`}
                    disabled={!canSubmit}
                >
                    {isSubmitting ? "..." : (children || "Submit")}
                </button>
            )}
        />
    );
};
