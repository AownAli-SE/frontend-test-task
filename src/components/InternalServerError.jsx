import { Button, Result } from "antd";
import { Link } from "react-router-dom";

export default function InternalServerError() {
  return (
    <Result
      status="500"
      title="500"
      subTitle="Sorry, something went wrong."
      extra={
        <Button type="primary">
          <Link to="/dashboard">Back Home</Link>
        </Button>
      }
    />
  );
}
