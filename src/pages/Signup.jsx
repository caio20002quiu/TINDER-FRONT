import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { IoArrowBack } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import { Container, PageContainer, BackButton, Title, Subtitle, Input, Button, Link } from '../styles/GlobalStyles';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 40px;
`;

const LoginText = styled.p`
  text-align: center;
  margin-top: 20px;
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

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    // Salvar dados temporários e ir para próxima tela
    localStorage.setItem('signupData', JSON.stringify({
      email: formData.email,
      password: formData.password
    }));
    
    navigate('/profile-details');
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <PageContainer>
          <BackButton onClick={() => navigate('/login')}>
            <IoArrowBack />
          </BackButton>

          <Title>Cadastrar</Title>
          <Subtitle>Crie sua conta</Subtitle>

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

            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar Senha"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <LoginText>
              Já tem uma conta? <Link onClick={() => navigate('/login')}>Entrar</Link>
            </LoginText>

            <div style={{ marginTop: 'auto' }}>
              <Button type="submit" disabled={loading}>
                {loading ? 'Criando conta...' : 'Continuar'}
              </Button>
            </div>
          </Form>
        </PageContainer>
      </motion.div>
    </Container>
  );
};

export default Signup;

