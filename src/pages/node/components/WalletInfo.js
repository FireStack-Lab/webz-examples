import { Input, Form, Button } from 'antd'

const FormItem = Form.Item

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 0
    }
  }
}

const AddressForm = ({ form, handleSubmit }) => (
  <Form>
    <FormItem>
      {form.getFieldDecorator('address', {
        rules: [
        {
            required: true,
            message: 'Please enter correct address!'
        },
        {
          validator: (rule, value, callback) => {
            if (value.match(/^[0-9a-fA-F]{40}$/)) {
              callback()
                return true
            }
            callback('Address should be 40 chars long!')
              return false
          }
        }
        ]
      })(
        <Input
          style={{ maxWidth: '100%' }}
          placeholder="Please enter correct address"
        />
      )}
    </FormItem>
    <FormItem {...tailFormItemLayout}>
      <Button
        type="primary"
        onClick={() => {
          const value = form.getFieldValue('address')
          handleSubmit(value)
        }}
      >
        Submit
      </Button>
    </FormItem>
  </Form>
)
const WrappedAddressForm = Form.create()(AddressForm)

export default WrappedAddressForm
