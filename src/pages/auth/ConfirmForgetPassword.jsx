/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom"
import { Form, Button, Spinner } from "react-bootstrap"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useResendOtpCodeMutation } from "@/services/auth.service"
import toast from "react-hot-toast"

// Yup schema for form validation
const schema = yup.object().shape({
  email: yup.string().email().required("Email field is required!")
})

const ConfirmForgetPassword = ({ onClose }) => {
  const navigate = useNavigate()

  // api
  const [resendOtpCode, { isLoading: isSubmitting }] =
    useResendOtpCodeMutation()
  // form
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: ""
    }
  })

  const onSubmit = async (data) => {
    try {
      await resendOtpCode(data).unwrap()
      navigate(`/auth/verify-email?email=${data.email}`, { replace: true })
    } catch (error) {
      if (error?.data) {
        toast.error(error?.data?.message || error?.data?.title)
      } else {
        toast.error("Something went wrong, please try again later.")
      }
    }
  }

  return (
    <Form
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      className="p-4"
    >
      <p>
        Write down your email, You&apos;ll get a verification code to reset your
        password.
      </p>
      <Form.Group controlId={`email_control`} className="mb-3">
        <Form.Label>
          <strong className="text-danger">*</strong> Email
        </Form.Label>
        <Controller
          name="email"
          type="email"
          control={control}
          render={({ field }) => (
            <Form.Control {...field} placeholder="example@example.com" />
          )}
        />
        {errors?.email && (
          <div className="invalid">{errors?.email.message}</div>
        )}
      </Form.Group>

      <Form.Group className="mb-3 d-grid" controlId={`password_control`}>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && (
            <>
              <Spinner size="sm" />
              &nbsp;
            </>
          )}
          Submit
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={isSubmitting}
          onClick={onClose}
          className="mt-2"
        >
          Cancel
        </Button>
      </Form.Group>
    </Form>
  )
}

export default ConfirmForgetPassword
