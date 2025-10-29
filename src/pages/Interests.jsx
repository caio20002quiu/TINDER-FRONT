import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { IoArrowBack, IoCamera, IoMusicalNotes, IoGameController, IoRestaurant, IoBicycle, IoBagHandle, IoMic, IoWater, IoWine, IoDiamond, IoFitness } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import { Container, PageContainer, BackButton, Title, Subtitle, Button } from '../styles/GlobalStyles';

const SkipButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: #e94586;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  padding: 10px;
  z-index: 10;

  &:hover {
    opacity: 0.7;
  }
`;

const InterestsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin: 40px 0;
  flex: 1;
`;

const InterestButton = styled(motion.button)`
  padding: 18px 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid ${props => props.$selected ? '#e94586' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 50px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Urbanist', sans-serif;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;

  ${props => props.$selected && `
    background: rgba(233, 69, 134, 0.2);
    box-shadow: 0 0 20px rgba(233, 69, 134, 0.3);
  `}

  &:hover {
    border-color: #e94586;
    background: rgba(255, 255, 255, 0.08);
  }
`;

const LoadMoreButton = styled.button`
  background: transparent;
  border: none;
  color: #e94586;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  padding: 20px;
  font-family: 'Urbanist', sans-serif;
  margin: 20px 0;

  &:hover {
    color: #ff5fa2;
  }
`;

const interestsList = [
  { id: 'photography', name: 'Fotografia', icon: <IoCamera /> },
  { id: 'cooking', name: 'Culinária', icon: <IoRestaurant /> },
  { id: 'videogames', name: 'Videogames', icon: <IoGameController /> },
  { id: 'music', name: 'Música', icon: <IoMusicalNotes /> },
  { id: 'travelling', name: 'Viajar', icon: <IoBicycle /> },
  { id: 'shopping', name: 'Compras', icon: <IoBagHandle /> },
  { id: 'speeches', name: 'Palestras', icon: <IoMic /> },
  { id: 'artscrafts', name: 'Arte e Artesanato', icon: <IoDiamond /> },
  { id: 'swimming', name: 'Natação', icon: <IoWater /> },
  { id: 'drinking', name: 'Drinks', icon: <IoWine /> },
  { id: 'extremesports', name: 'Esportes Radicais', icon: <IoDiamond /> },
  { id: 'fitness', name: 'Fitness', icon: <IoFitness /> }
];

const Interests = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleInterest = (interestId) => {
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(selectedInterests.filter(id => id !== interestId));
    } else {
      setSelectedInterests([...selectedInterests, interestId]);
    }
  };

  const handleContinue = async () => {
    setLoading(true);
    setError('');

    const signupData = JSON.parse(localStorage.getItem('signupData') || '{}');
    const userData = {
      ...signupData,
      interests: selectedInterests
    };

    const result = await signup(userData);
    
    if (result.success) {
      localStorage.removeItem('signupData');
      navigate('/home');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleSkip = async () => {
    await handleContinue();
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <PageContainer>
          <BackButton onClick={() => navigate('/profile-details')}>
            <IoArrowBack />
          </BackButton>

          <SkipButton onClick={handleSkip}>Pular</SkipButton>

          <Title>Gostos e Interesses</Title>
          <Subtitle>Compartilhe seus gostos e paixões com outros</Subtitle>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid #ef4444',
              color: '#fca5a5',
              padding: '15px',
              borderRadius: '12px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <InterestsGrid>
            {interestsList.map(interest => (
              <InterestButton
                key={interest.id}
                $selected={selectedInterests.includes(interest.id)}
                onClick={() => toggleInterest(interest.id)}
                whileTap={{ scale: 0.95 }}
              >
                {interest.icon}
                {interest.name}
              </InterestButton>
            ))}
          </InterestsGrid>

          <LoadMoreButton>Carregar Mais</LoadMoreButton>

          <Button onClick={handleContinue} disabled={loading}>
            {loading ? 'Finalizando...' : 'Continuar'}
          </Button>
        </PageContainer>
      </motion.div>
    </Container>
  );
};

export default Interests;

