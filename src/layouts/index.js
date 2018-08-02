import React from 'react'
import { Row, Col } from 'antd'
import styles from './index.css'
import Header from './Header'
import withRouter from 'umi/withRouter'

function Layout({ children, location }) {
  return (
    <div className={styles.normal}>
      <Header location={location} />
      <div className={styles.content}>
        <div className={styles.main}>
          <Row gutter={16}>
            <Col span={24}>{children}</Col>
          </Row>
        </div>
      </div>
    </div>
  )
}

export default withRouter(Layout)
