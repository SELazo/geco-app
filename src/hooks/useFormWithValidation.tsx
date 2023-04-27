import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormValues, FormErrors, validationSchema } from './types';

type UseFormWithValidationProps = {
  defaultValues?: FormValues;
  onSubmit: (data: FormValues) => void;
};

export const useFormWithValidation = ({
  defaultValues = {},
  onSubmit,
}: UseFormWithValidationProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const onSubmitHandler = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      await onSubmit(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmitHandler),
    isSubmitting,
    errors: errors as FormErrors,
  };
};
