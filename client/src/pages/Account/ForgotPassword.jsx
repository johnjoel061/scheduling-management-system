import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Form, Input, Spin, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import useRequestPasswordReset from "../../hooks/AuthHook/useRequestPasswordReset";
import useResetPassword from "../../hooks/AuthHook/usePasswordReset";
// images
import Logo from "../../assets/logo.jpg";
import { useAuth } from "../../contexts/AuthContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);

  const { requestPasswordReset, loading: requestPasswordLoading } =
    useRequestPasswordReset();
  const { resetPassword, loading: resetPasswordLoading } = useResetPassword();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        navigate("/admin-dashboard");
      }
    }
  }, [user, navigate]);

  const handleRequestPasswordReset = async (values) => {
    setIsVerificationCodeSent(true);
    await requestPasswordReset(values.email);
  };

  const handleResetPassword = async (values) => {
    await resetPassword(
      values.email,
      values.verificationCode,
      values.newPassword
    );
  };

  const handleLoginAccountClick = () => {
    setLinkLoading(true);
    setTimeout(() => {
      setLinkLoading(false);
      navigate("/login");
    }, 1000); // Simulate a loading delay of 1 second
  };

  const getResponsiveHeight = () => {
    const width = window.innerWidth;
    if (width <= 320) return "40px";
    if (width <= 480) return "50px";
    if (width <= 768) return "70px";
    return "90px";
  };

  const [logoHeight, setLogoHeight] = useState(getResponsiveHeight());

  useEffect(() => {
    const handleResize = () => {
      setLogoHeight(getResponsiveHeight());
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const wrapperStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
    background: "#0A5E4F",
  };

  const cardStyles = {
    width: "100%",
    maxWidth: "400px",
    margin: "0 auto",
    padding: "20px",
  };

  const logoContainerStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    borderBottom: "solid 1px rgba(0, 0, 0, 0.16)",
    padding: "10px",
    marginBottom: "1rem",
  };

  const formContainerStyles = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  };

  const titleStyles = {
    textAlign: "center",
  };

  const sloganStyles = {
    textAlign: "center",
    paddingBottom: "1.5rem",
  };

  const buttonStyles = {
    width: "100%",
    marginTop: "1rem",
  };

  const loginLinkStyles = {
    float: "right",
    cursor: "pointer",
    color: "#1677ff",
  };

  return (
    <div style={wrapperStyles}>
      <Card style={cardStyles}>
        {/* LOGO HERE */}
        <Link to="/login" style={logoContainerStyles}>
          <span className="logo">
            <img
              src={Logo}
              alt="Logo"
              style={{ height: logoHeight, maxWidth: "100%" }}
            />
          </span>
        </Link>

        <div style={formContainerStyles}>
          <Typography.Title level={3} strong style={titleStyles}>
            {isVerificationCodeSent
              ? "Reset Your Password"
              : "Request Password Reset"}
          </Typography.Title>
          <Typography.Text type="secondary" strong style={sloganStyles}>
            {isVerificationCodeSent
              ? "Enter the verification code sent to your email and your new password."
              : "Enter your email address to receive a verification code."}
          </Typography.Text>
          <Form
            layout="vertical"
            onFinish={
              isVerificationCodeSent
                ? handleResetPassword
                : handleRequestPasswordReset
            }
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              style={{ fontWeight: "bold" }}
              rules={[
                {
                  required: true,
                  message: "Please input your email",
                },
                {
                  type: "email",
                  message: "The input is not valid Email!",
                },
              ]}
              className="custom-input"
            >
              <Input
                size="large"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isVerificationCodeSent}
                className="ant-input"
              />
            </Form.Item>
            {isVerificationCodeSent && (
              <>
                <Form.Item
                  label="Verification Code"
                  name="verificationCode"
                  style={{ fontWeight: "bold" }}
                  rules={[
                    {
                      required: true,
                      message: "Please input the verification code",
                    },
                  ]}
                  className="custom-input"
                >
                  <Input
                    size="large"
                    placeholder="Enter the verification code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="ant-input"
                  />
                </Form.Item>
                <Form.Item
                  label="New Password"
                  name="newPassword"
                  style={{ fontWeight: "bold" }}
                  rules={[
                    {
                      required: true,
                      message: "Please input your new password",
                    },
                  ]}
                  className="custom-input"
                >
                  <Input.Password
                    size="large"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="ant-input"
                  />
                </Form.Item>
              </>
            )}

            <Form.Item>
              <Button
                type={`${
                  resetPasswordLoading || requestPasswordLoading
                    ? ""
                    : "primary"
                }`}
                htmlType="submit"
                size="large"
                disabled={resetPasswordLoading || requestPasswordLoading}
                style={{ fontWeight: "bold", background: "#0A5E4F" }}
              >
                {resetPasswordLoading || requestPasswordLoading ? (
                  <Spin indicator={<LoadingOutlined spin />} />
                ) : isVerificationCodeSent ? (
                  "Reset Password"
                ) : (
                  "Password Reset"
                )}
              </Button>
            </Form.Item>
            <div style={loginLinkStyles} onClick={handleLoginAccountClick}>
              <small style={{ fontWeight: "bold", color: "#0A5E4F" }}>
                {linkLoading ? <Spin indicator={<LoadingOutlined spin />} /> : "Login?"}
              </small>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
