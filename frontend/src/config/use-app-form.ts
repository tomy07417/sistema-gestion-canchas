import { createFormHook } from "@tanstack/react-form";

import { FormContainer } from "@/components/form-components/FormContainer/FormContainer";
import { PasswordField, TextField } from "@/components/form-components/InputFields/InputFields";
import { SubmitButton } from "@/components/form-components/SubmitButton/SubmitButton";
import { fieldContext, formContext } from "@/config/form-context";
import { CheckboxField } from "@/components/form-components/InputFields/CheckboxField";
import { SelectField } from "@/components/form-components/InputFields/SelectField";

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    PasswordField,
    CheckboxField,
    SelectField,
  },
  formComponents: {
    FormContainer,
    SubmitButton,
  },
});
