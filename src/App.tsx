import { Layout, Typography, Space, Card } from 'antd';
import { FlaggerList, useFlaggers } from '@the-universal-group/ui-react';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  // Default branch filter to "seattle" for ATC
  const { data: flaggers, isLoading, error } = useFlaggers({ branch: 'seattle' });

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
        <Title level={3} style={{ margin: '16px 0' }}>
          ATC Seattle Dispatch
        </Title>
      </Header>
      <Content style={{ padding: '24px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card title="Flaggers" loading={isLoading}>
            {error && (
              <div style={{ color: 'red', marginBottom: '16px' }}>
                Error loading flaggers: {error.message}
              </div>
            )}
            {flaggers && (
              <FlaggerList
                flaggers={flaggers}
                onSelect={(flagger) => {
                  console.log('Selected flagger:', flagger);
                  // TODO: Navigate to flagger detail view
                }}
              />
            )}
          </Card>
        </Space>
      </Content>
    </Layout>
  );
}

export default App;
