import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const PopupContainer = styled(motion.div)`
  max-width: 430px;
  width: 100%;
  text-align: center;
  position: relative;
`;

const OrbitContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  margin-bottom: 40px;
`;

const Orbit = styled(motion.div)`
  position: absolute;
  border: 2px solid;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const UserCircle = styled(motion.div)`
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 5px solid white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  z-index: 2;
`;

const LeftUser = styled(UserCircle)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin-left: -90px;
`;

const RightUser = styled(UserCircle)`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  margin-left: 90px;
`;

const LikeIcon = styled(motion.div)`
  position: absolute;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.6);
`;

const HeartIcon = styled(motion.div)`
  position: absolute;
  font-size: 40px;
  z-index: 3;
`;

const FloatingIcon = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
`;

const Title = styled(motion.h1)`
  font-size: 56px;
  font-weight: 800;
  color: white;
  margin: 0 0 10px 0;
`;

const Subtitle = styled(motion.p)`
  font-size: 24px;
  color: white;
  margin: 0 0 10px 0;
  font-weight: 600;
`;

const MatchText = styled(motion.p)`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 60px 0;
`;

const Button = styled(motion.button)`
  width: 100%;
  max-width: 350px;
  padding: 20px;
  background: transparent;
  border: none;
  border-radius: 50px;
  color: white;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Urbanist', sans-serif;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const StartConversationButton = styled(Button)`
  background: linear-gradient(90deg, #e94586 0%, #a855f7 100%);
  box-shadow: 0 8px 24px rgba(233, 69, 134, 0.4);

  &:hover {
    box-shadow: 0 12px 32px rgba(233, 69, 134, 0.6);
  }
`;

const KeepDatingButton = styled(Button)`
  background: transparent;
  color: #e94586;
  font-size: 20px;
`;

const MatchPopup = ({ user, commonInterests, onClose, onMessage }) => {
  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <PopupContainer
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
        >
          <OrbitContainer>
            {/* Órbitas animadas */}
            <Orbit
              style={{
                width: '400px',
                height: '400px',
                borderColor: 'rgba(233, 69, 134, 0.3)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            <Orbit
              style={{
                width: '320px',
                height: '320px',
                borderColor: 'rgba(168, 85, 247, 0.3)',
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            />
            <Orbit
              style={{
                width: '240px',
                height: '240px',
                borderColor: 'rgba(59, 130, 246, 0.3)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            />

            {/* Círculos dos usuários */}
            <LeftUser
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
            <RightUser
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />

            {/* Ícone de like */}
            <LikeIcon
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            >
              👍
            </LikeIcon>

            {/* Corações flutuantes */}
            <HeartIcon
              style={{ bottom: '30%', left: '50%', marginLeft: '-20px' }}
              initial={{ scale: 0, y: 0 }}
              animate={{ scale: 1, y: -20 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              ❤️
            </HeartIcon>

            <HeartIcon
              style={{ bottom: '25%', left: '50%', marginLeft: '10px', fontSize: '30px' }}
              initial={{ scale: 0, y: 0 }}
              animate={{ scale: 1, y: -15 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              ❤️
            </HeartIcon>

            {/* Ícones coloridos flutuantes */}
            <FloatingIcon
              style={{
                width: '20px',
                height: '20px',
                background: '#10b981',
                top: '15%',
                left: '20%',
              }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <FloatingIcon
              style={{
                width: '25px',
                height: '25px',
                background: '#f59e0b',
                top: '20%',
                left: '10%',
              }}
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <FloatingIcon
              style={{
                width: '30px',
                height: '30px',
                background: '#3b82f6',
                bottom: '15%',
                right: '15%',
              }}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            />
            <FloatingIcon
              style={{
                width: '25px',
                height: '25px',
                background: '#ec4899',
                bottom: '20%',
                right: '25%',
              }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            <FloatingIcon
              style={{
                width: '35px',
                height: '35px',
                background: '#f59e0b',
                top: '25%',
                right: '15%',
              }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2.3, repeat: Infinity }}
            />
            <FloatingIcon
              style={{
                width: '28px',
                height: '28px',
                background: '#6366f1',
                bottom: '30%',
                left: '15%',
              }}
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 2.6, repeat: Infinity }}
            />
          </OrbitContainer>

          <Title
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            Parabéns!
          </Title>

          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            É um Match!
          </Subtitle>

          <MatchText
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            {user?.firstName} e você curtiram um ao outro
          </MatchText>

          {commonInterests && commonInterests.length > 0 && (
            <div style={{ margin: '20px 0', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
              <p style={{ color: 'white', fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                🎯 {commonInterests.length} interesse{commonInterests.length > 1 ? 's' : ''} em comum:
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {commonInterests.map((interest, index) => (
                  <span 
                    key={index}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      padding: '6px 12px',
                      borderRadius: '15px',
                      fontSize: '14px',
                      color: 'white'
                    }}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          <StartConversationButton
            onClick={onMessage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            whileTap={{ scale: 0.95 }}
          >
            💬 Iniciar Conversa
          </StartConversationButton>

          <KeepDatingButton
            onClick={onClose}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            whileTap={{ scale: 0.95 }}
          >
            Continuar Explorando
          </KeepDatingButton>
        </PopupContainer>
      </Overlay>
    </AnimatePresence>
  );
};

export default MatchPopup;

