import InputBottomSheet, {
  type RefProps as BottomSheetRefProps,
} from './BottomSheet'
import InputPassword, { type RefProps as PasswordRefProps } from './Password'
import InputRoot, { type RefProps as RootRefProps } from './Root'

const Inputs = {
  Password: InputPassword,
  Root: InputRoot,
  BottomSheet: InputBottomSheet,
}

export type { PasswordRefProps, RootRefProps, BottomSheetRefProps }
export default Inputs
