import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const SplashContainer = styled.div`
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  height: 100vh;
  background: linear-gradient(180deg, #1a0d2e 0%, #2e1065 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const OrbitContainer = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Orbit = styled(motion.div)`
  position: absolute;
  border: 2px solid;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const FloatingIcon = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Logo = styled(motion.div)`
  text-align: center;
  z-index: 10;
  margin-bottom: 100px;
`;

const LogoIcon = styled.div`
  font-size: 60px;
  margin-bottom: 20px;
`;

const LogoText = styled.h1`
  font-size: 56px;
  font-weight: 800;
  color: white;
  margin: 0;
  margin-bottom: 10px;
`;

const LogoSubtext = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
`;

const GetStartedButton = styled(motion.button)`
  position: absolute;
  bottom: 80px;
  background: transparent;
  border: none;
  color: #e94586;
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Urbanist', sans-serif;
  z-index: 10;

  &:hover {
    color: #ff5fa2;
  }
`;

const Splash = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  return (
    <SplashContainer>
      <OrbitContainer>
        {/* Órbitas animadas */}
        <Orbit
          style={{
            width: '500px',
            height: '500px',
            borderColor: 'rgba(233, 69, 134, 0.2)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <Orbit
          style={{
            width: '400px',
            height: '400px',
            borderColor: 'rgba(168, 85, 247, 0.2)',
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
        <Orbit
          style={{
            width: '300px',
            height: '300px',
            borderColor: 'rgba(59, 130, 246, 0.2)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />

        {/* Ícones flutuantes */}
        <FloatingIcon
          style={{
            width: '30px',
            height: '30px',
            background: '#10b981',
            top: '20%',
            left: '50%',
          }}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <FloatingIcon
          style={{
            width: '40px',
            height: '40px',
            background: '#f59e0b',
            top: '30%',
            left: '15%',
          }}
          animate={{
            y: [0, -15, 0],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <FloatingIcon
          style={{
            width: '25px',
            height: '25px',
            background: '#ec4899',
            top: '50%',
            left: '10%',
          }}
          animate={{
            y: [0, -8, 0],
          }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <FloatingIcon
          style={{
            width: '50px',
            height: '50px',
            background: '#6366f1',
            top: '70%',
            left: '80%',
          }}
          animate={{
            y: [0, -12, 0],
          }}
          transition={{ duration: 2.2, repeat: Infinity }}
        />
        <FloatingIcon
          style={{
            width: '35px',
            height: '35px',
            background: '#3b82f6',
            top: '80%',
            left: '20%',
          }}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{ duration: 2.8, repeat: Infinity }}
        />

        {/* Corações */}
        <FloatingIcon
          style={{
            width: '40px',
            height: '40px',
            background: 'transparent',
            fontSize: '30px',
            top: '85%',
            left: '70%',
          }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ❤️
        </FloatingIcon>
      </OrbitContainer>

      <Logo
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <LogoIcon>❤️</LogoIcon>
        <LogoText>Destined</LogoText>
        <LogoSubtext>Aplicativo de Encontros</LogoSubtext>
      </Logo>

      <GetStartedButton
        onClick={() => navigate('/login')}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Começar →
      </GetStartedButton>
    </SplashContainer>
  );
};

export default Splash;

