import { createFormHook } from '@tanstack/react-form'

import {
  Select,
  SelectField,
  SubscribeButton,
  TextArea,
  TextField,
  NumberField,
  ComboboxField,
} from '../components/FormComponents'
import { fieldContext, formContext } from './form-context'

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    NumberField,
    Select,
    SelectField,
    ComboboxField,
    TextArea,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
})
