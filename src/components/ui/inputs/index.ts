import InputPassword, { type RefProps as PasswordRefProps } from './Password'
import InputRoot, { type RefProps as RootRefProps } from './Root'

const Inputs = {
  Password: InputPassword,
  Root: InputRoot,
}

export type { PasswordRefProps, RootRefProps }
export default Inputs
