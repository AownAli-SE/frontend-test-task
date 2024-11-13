import React from "react";
import { AppstoreOutlined, CarOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, theme, Typography } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;

const { Title } = Typography;

// Menu items
const items = [
  { icon: UserOutlined, label: "Profile", link: "profile" },
  { icon: AppstoreOutlined, label: "Categories", link: "categories" },
  { icon: CarOutlined, label: "Cars", link: "cars" },
].map((item, index) => ({
  key: String(index + 1),
  icon: React.createElement(item.icon),
  label: <Link to={item.link}>{item.label}</Link>,
}));

// Component
export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const heading = location.pathname
    .slice(1)
    .split("/")
    .map((text) => text[0].toUpperCase() + text.slice(1))
    .join(" / ");

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["4"]} items={items} />
      </Sider>
      <Layout>
        <Header
          style={{
            background: colorBgContainer,
          }}
        >
          <Title style={{ display: "flex", justifyContent: "space-between" }} level={3}>
            {heading} <Button onClick={handleLogout}>Logout</Button>
          </Title>
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          It is a Demo Application
        </Footer>
      </Layout>
    </Layout>
  );
}
