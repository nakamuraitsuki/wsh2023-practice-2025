import { useState } from 'react';
import { useFormik } from 'formik';
import { useSignIn } from '../../../hooks/useSignIn';
import { useCloseModal, useIsOpenModal, useOpenModal } from '../../../store/modal';
import { Modal } from '../../foundation/Modal';
import { PrimaryButton } from '../../foundation/PrimaryButton';
import { TextInput } from '../../foundation/TextInput';

import * as styles from './SignInModal.styles';

const NOT_INCLUDED_AT_CHAR_REGEX = /^(?:[^@]*){6,}$/;
const NOT_INCLUDED_SYMBOL_CHARS_REGEX = /^(?:(?:[a-zA-Z0-9]*){2,})+$/;

export type SignInForm = {
  email: string;
  password: string;
};

export const SignInModal = () => {
  const isOpened = useIsOpenModal('SIGN_IN');
  const { signIn } = useSignIn();

  const handleOpenModal = useOpenModal();
  const handleCloseModal = useCloseModal();

  const [submitError, setSubmitError] = useState<Error | null>(null);
  
  // Formikでフォームとバリデーションを管理
  const formik = useFormik<SignInForm>({
    initialValues: {
      email: '',
      password: '',
    },
    async onSubmit(values, { resetForm }) {
      try {
        await signIn({
          variables: {
            email: values.email,
            password: values.password,
          },
        });
        resetForm();
        setSubmitError(null);
        handleCloseModal();
      } catch (err) {
        setSubmitError(err as Error);
      }
    },
    // Formikのvalidate関数内でバリデーションを記述
    validate(values) {
      const errors: { email?: string; password?: string } = {};

      if (values.email !== '' && NOT_INCLUDED_AT_CHAR_REGEX.test(values.email)) {
        errors.email = 'メールアドレスに@が含まれていないか、長さが不足しています';
      }

      if (values.password !== '' && NOT_INCLUDED_SYMBOL_CHARS_REGEX.test(values.password)) {
        errors.password = 'パスワードには英数字以外の文字を含めてください';
      }

      return errors;
    },
    validateOnChange: true,
  });

  return (
    <Modal onHide={handleCloseModal} show={isOpened}>
      <div className={styles.inner()}>
        <header className={styles.header()}>
          <h2 className={styles.heading()}>ログイン</h2>
          <button
            className={styles.switchToSignUpButton()}
            data-testid="modal-switch-to-signup"
            onClick={() => handleOpenModal('SIGN_UP')}
          >
            会員登録
          </button>
        </header>
        <form className={styles.form()} onSubmit={formik.handleSubmit}>
          <div className={styles.inputList()}>
            <TextInput
              required
              id="email"
              label="メールアドレス"
              onChange={formik.handleChange}
              placeholder="メールアドレスを入力"
              type="email"
              value={formik.values.email}
            />
            <p className={styles.error()}>{formik.errors.email}</p>

            <TextInput
              required
              id="password"
              label="パスワード"
              onChange={formik.handleChange}
              placeholder="パスワードを入力"
              type="password"
              value={formik.values.password}
            />
            <p className={styles.error()}>{formik.errors.password}</p>
          </div>
          <div className={styles.submitButton()}>
            <PrimaryButton size="base" type="submit">
              ログイン
            </PrimaryButton>
          </div>
          {submitError != null ? <p className={styles.error()}>ログインに失敗しました</p> : null}
        </form>
      </div>
    </Modal>
  );
};
