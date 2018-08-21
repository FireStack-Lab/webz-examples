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

const DsBlockForm = ({ form, handleSubmit }) => (
  <Form>
    <FormItem>
      {form.getFieldDecorator('DsBlockNumber', {
        rules: [
          {
            required: true,
            message: 'Please enter correct DsBlockNumber!'
          },
          {
            validator: (rule, value, callback) => {
              if (value.match(/^[0-9]/)) {
                callback()
                return true
              }
              callback('DsBlockNumber should be numbers!')
              return false
            }
          }
        ]
      })(
        <Input
          style={{ maxWidth: '100%' }}
          placeholder="Please enter correct DsBlockNumber"
        />
      )}
    </FormItem>
    <FormItem {...tailFormItemLayout}>
      <Button
        type="primary"
        onClick={() => {
          const value = form.getFieldValue('DsBlockNumber')
          handleSubmit(value)
        }}
      >
        Submit
      </Button>
    </FormItem>
  </Form>
)
const WrappedDsBlockForm = Form.create()(DsBlockForm)

export default WrappedDsBlockForm
