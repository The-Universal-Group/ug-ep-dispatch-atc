import { useEffect, useContext, useState } from 'react';
import { Layout, Typography, Space, Card, Spin } from 'antd';
import {
  FlaggerList,
  useFlaggers,
  UgContext,
  createDispatchApi,
  setDispatchApi
} from '@the-universal-group/ui-react';

const { Header, Content } = Layout;
const { Title } = Typography;

// Separate component that uses dispatch hooks
function DispatchContent() {
  // Default branch filter to "seattle" for ATC
  const { data: flaggers, isLoading, error } = useFlaggers({ branch: 'seattle' });

  return (
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
  );
}

function App() {
  const ctx = useContext(UgContext);
  const [apiInitialized, setApiInitialized] = useState(false);

  // Initialize dispatch API once config is loaded
  useEffect(() => {
    if (!ctx?.isReady) return;

    // Get apiUrl from app config (loaded from S3 components.json)
    const apiUrl = (ctx.config as any).apiUrl || 'http://localhost:3001';

    const dispatchApi = createDispatchApi({
      baseUrl: apiUrl,
      getToken: async () => {
        return (window as any).ugAuth?.getToken() || '';
      },
    });

    setDispatchApi(dispatchApi);
    setApiInitialized(true);
  }, [ctx?.isReady, ctx?.config]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
        <Title level={3} style={{ margin: '16px 0' }}>
          ATC Seattle Dispatch
        </Title>
      </Header>
      <Content style={{ padding: '24px' }}>
        {!apiInitialized ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" tip="Initializing..." />
          </div>
        ) : (
          <DispatchContent />
        )}
      </Content>
    </Layout>
  );
}

export default App;
