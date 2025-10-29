import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { IoArrowBack } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import { Container, PageContainer, BackButton, Title, Input, Button, Link } from '../styles/GlobalStyles';

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 60px 0 80px 0;
`;

const LogoIcon = styled.div`
  font-size: 40px;
  margin-bottom: 15px;
`;

const LogoText = styled.h2`
  font-size: 42px;
  font-weight: 800;
  margin: 0 0 5px 0;
`;

const LogoSubtext = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const SignupText = styled.p`
  text-align: center;
  margin-top: 30px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid #ef4444;
  color: #fca5a5;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 20px;
  text-align: center;
`;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <PageContainer>
          <BackButton onClick={() => navigate('/')}>
            <IoArrowBack />
          </BackButton>

          <Title>Entrar</Title>

          <LogoSection>
            <LogoIcon>❤️</LogoIcon>
            <LogoText>Destined</LogoText>
            <LogoSubtext>Aplicativo de Encontros</LogoSubtext>
          </LogoSection>

          <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              type="password"
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <SignupText>
              <Link onClick={() => navigate('/signup')}>Criar conta</Link>
            </SignupText>

            <div style={{ marginTop: 'auto' }}>
              <Button type="submit" disabled={loading}>
                {loading ? 'Entrando...' : 'Continuar'}
              </Button>
            </div>
          </Form>
        </PageContainer>
      </motion.div>
    </Container>
  );
};

export default Login;

