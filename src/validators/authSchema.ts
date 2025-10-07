import * as Yup from 'yup';

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
});

export const validatePasswordResetTokenSchema = Yup.object().shape({
  token: Yup.string()
    .length(6, 'Token inválido')
    .required('Token é obrigatório'),
});

export const resetPasswordSchema = Yup.object().shape({
  token: Yup.string()
    .length(6, 'Token inválido')
    .required('Token é obrigatório'),
  newPassword: Yup.string()
    .min(6, 'A nova senha deve ter pelo menos 6 caracteres')
    .required('A nova senha é obrigatória'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'As senhas devem corresponder')
    .required('A confirmação da senha é obrigatória'),
});
