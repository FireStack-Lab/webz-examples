// import brace from 'brace'
import { Row, Col, Tabs } from 'antd'
import AceEditor from 'react-ace'
import 'brace/mode/ocaml'
import 'brace/mode/json'
import 'brace/theme/monokai'

const TabPane = Tabs.TabPane

const SmartContractCodeString = `(* HelloWorld contract *)


(***************************************************)
(*               Associated library                *)
(***************************************************)
library HelloWorld

let one_msg =
  fun (msg : Message) =>
  let nil_msg = Nil {Message} in
  Cons {Message} msg nil_msg

let not_owner_code = Int32 1
let set_hello_code = Int32 2

(***************************************************)
(*             The contract definition             *)
(***************************************************)

contract HelloWorld
(owner: Address)

field welcome_msg : String = ""

transition setHello (msg : String)
  is_owner = builtin eq owner _sender;
  match is_owner with
  | False =>
    msg = {_tag : "Main"; _recipient : _sender; _amount : Uint128 0; code : not_owner_code};
    msgs = one_msg msg;
    send msgs
  | True =>
    welcome_msg := msg;
    msg = {_tag : "Main"; _recipient : _sender; _amount : Uint128 0; code : set_hello_code};
    msgs = one_msg msg;
    send msgs
  end
end


transition getHello ()
    r <- welcome_msg;
    msg = {_tag : "Main"; _recipient : _sender; _amount : Uint128 0; msg : r};
    msgs = one_msg msg;
    send msgs
end`

const InitJson = `[
    {
        "vname" : "owner",
        "type" : "Address",
        "value" : "0x1234567890123456789012345678901234567890"
    },
    {
        "vname" : "_creation_block",
        "type" : "BNum",
        "value" : "1"
    }
]`

const BlockChainJson = `[
  {
    "vname": "BLOCKNUMBER",
    "type": "BNum",
    "value": "100"
  }
]`

const StateJson = `[
  {
    "vname": "_balance",
    "type" : "Uint128",
    "value": "0"
  }
]`

const MessageJson = `{
    "_tag": "setHello",
    "_amount": "0",
    "_sender" : "0x1234567890123456789012345678901234567890",
    "params": [
      {
        "vname": "msg",
        "type": "String",
        "value": "Hello World"
      }
   ]
}`

const CodeEditor = ({ mode, name, onLoad, onChange, code, ...props }) => (
  <AceEditor
    mode={mode}
    theme="monokai"
    name={name}
    onLoad={onLoad}
    onChange={onChange}
    fontSize={14}
    showPrintMargin={true}
    showGutter={true}
    highlightActiveLine={true}
    height={'600px'}
    width={'100%'}
    value={code}
    setOptions={{
      enableBasicAutocompletion: false,
      enableLiveAutocompletion: false,
      enableSnippets: false,
      showLineNumbers: true,
      tabSize: 2
    }}
  />
)

export default () => {
  return (
    <Row gutter={8}>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 12 }}
        lg={{ span: 12 }}
        xl={{ span: 12 }}
        xxl={{ span: 12 }}
      >
        <div style={{ padding: 16, width: '100%' }}>
          <Tabs>
            <TabPane tab="SmartContract" key="SmartContract">
              <CodeEditor
                name="SmartContract"
                mode="ocaml"
                code={SmartContractCodeString}
                onLoad={() => console.log('Contract Loaded')}
                onChange={data => {
                  const result = {
                    code: data.toString(),
                    type: 'SmartContract'
                  }
                  console.log(result)
                }}
              />
            </TabPane>
            <TabPane tab="Init.json" key="InitJson">
              <CodeEditor
                name="InitJson"
                mode="json"
                code={InitJson}
                onLoad={() => console.log('init.Json Loaded')}
                onChange={data => {
                  const result = { code: data.toString(), type: 'InitJson' }
                  console.log(result)
                }}
              />
            </TabPane>
            <TabPane tab="BlockChain.json" key="BlockChainJson">
              <CodeEditor
                name="BlockChainJson"
                mode="json"
                code={BlockChainJson}
                onLoad={() => console.log('BlockChain.json Loaded')}
                onChange={data => {
                  const result = {
                    code: data.toString(),
                    type: 'BlockChainJson'
                  }
                  console.log(result)
                }}
              />
            </TabPane>
            <TabPane tab="State.json" key="StateJson">
              <CodeEditor
                name="StateJson"
                mode="json"
                code={StateJson}
                onLoad={() => console.log('State.Json Loaded')}
                onChange={data => {
                  const result = { code: data.toString(), type: 'StateJson' }
                  console.log(result)
                }}
              />
            </TabPane>
            <TabPane tab="Message.json" key="MessageJson">
              <CodeEditor
                name="MessageJson"
                mode="json"
                code={MessageJson}
                onLoad={() => console.log('Message.Json Loaded')}
                onChange={data => {
                  const result = { code: data.toString(), type: 'MessageJson' }
                  console.log(result)
                }}
              />
            </TabPane>
          </Tabs>
        </div>
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 12 }}
        lg={{ span: 12 }}
        xl={{ span: 12 }}
        xxl={{ span: 12 }}
      >
        <h2>Smart Contract</h2>
      </Col>
    </Row>
  )
}
