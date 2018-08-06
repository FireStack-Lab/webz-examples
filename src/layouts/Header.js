import { Menu, Icon } from 'antd'
import Link from 'umi/link'

function Header({ location }) {
  return (
    <Menu selectedKeys={[location.pathname]} mode="horizontal" theme="dark">
      <Menu.Item key="/">
        <Link to="/">
          <Icon type="home" />Home
        </Link>
      </Menu.Item>
      <Menu.Item key="/node">
        <Link to="/node">
          <Icon type="bars" />node
        </Link>
      </Menu.Item>
      <Menu.Item key="/wallet">
        <Link to="/wallet">
          <Icon type="wallet" />wallet
        </Link>
      </Menu.Item>
      <Menu.Item key="/docs">
        <a href="//scilla-lang.org" target="_blank" rel="noopener noreferrer">
          Docs
        </a>
      </Menu.Item>
      <Menu.Item key="/IDE">
        <a href="//ide.zilliqa.com/" target="_blank" rel="noopener noreferrer">
          IDE
        </a>
      </Menu.Item>
      <Menu.Item key="/404">
        <Link to="/page-you-dont-know">
          <Icon type="frown-circle" />404
        </Link>
      </Menu.Item>
    </Menu>
  )
}

export default Header
