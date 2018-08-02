import { List, Card, Spin, Input, Form, Button } from 'antd'
import { connect } from 'dva'

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
      })(<Input placeholder="Please enter correct address" />)}
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

const CardList = ({
  dispatch,
  nodeInfo,
  walletInfo,
  loadingWallet,
  loadingNode
}) => {
  const { isConnected, libVersion, networkId, url } = nodeInfo
  const { balance, nonce } = walletInfo
  const data = [
    {
      title: 'Node Info',
      content: loadingNode ? (
        <Spin />
      ) : (
        <div>
          <div>
            <span style={{ marginRight: 8, fontWeight: '700' }}>url:</span>
            <span>{url}</span>
          </div>
          <div>
            <span style={{ marginRight: 8, fontWeight: '700' }}>
              isConnected:
            </span>
            <span>{isConnected.toString()}</span>
          </div>
          <div>
            <span style={{ marginRight: 8, fontWeight: '700' }}>
              libVersion:
            </span>
            <span>{libVersion}</span>
          </div>
          <div>
            <span style={{ marginRight: 8, fontWeight: '700' }}>
              networkId:
            </span>
            <span>{networkId}</span>
          </div>
        </div>
      )
    },
    {
      title: 'Wallet Info',
      content: (
        <div>
          <WrappedAddressForm
            handleSubmit={data =>
              dispatch({
                type: 'node/getWalletInfo',
                payload: { address: data }
              })
            }
          />
          {loadingWallet ? (
            <Spin />
          ) : (
            <div>
              <div>
                <span style={{ marginRight: 8, fontWeight: '700' }}>
                  balance:
                </span>
                <span>{balance}</span>
              </div>
              <div>
                <span style={{ marginRight: 8, fontWeight: '700' }}>
                  nonce:
                </span>
                <span>{nonce}</span>
              </div>
            </div>
          )}
        </div>
      )
    }
  ]
  return (
    <List
      grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
      dataSource={data}
      renderItem={item => (
        <List.Item>
          <Card title={item.title}>{item.content}</Card>
        </List.Item>
      )}
    />
  )
}

function mapStateToProps(state) {
  const { nodeInfo, walletInfo, loadingWallet, loadingNode } = state.node
  return { nodeInfo, walletInfo, loadingWallet, loadingNode }
}

export default connect(mapStateToProps)(CardList)
