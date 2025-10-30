import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { IoArrowBack, IoHeart, IoClose, IoThumbsUp, IoLocation, IoChatbubble, IoCamera } from 'react-icons/io5';
import axios from 'axios';
import MatchPopup from '../components/MatchPopup';

const Container = styled.div`
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(180deg, #1a0d2e 0%, #2e1065 100%);
`;

const Header = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 430px;
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  background: linear-gradient(180deg, rgba(26, 13, 46, 0.95) 0%, transparent 100%);
  backdrop-filter: blur(10px);
`;

const BackButton = styled.button`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: scale(1.05);
  }
`;

const PhotosContainer = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
`;

const PhotoSlider = styled.div`
  display: flex;
  transition: transform 0.3s ease;
  transform: translateX(-${props => props.$currentIndex * 100}%);
  height: 100%;
`;

const Photo = styled.div`
  min-width: 100%;
  height: 100%;
  background: ${props => props.$photo 
    ? `url(${props.$photo}) center/cover no-repeat` 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  position: relative;
`;

const PhotoIndicators = styled.div`
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  display: flex;
  gap: 5px;
  padding: 0 20px;
  z-index: 10;
`;

const Indicator = styled.div`
  flex: 1;
  height: 3px;
  background: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 2px;
`;

const PhotoNav = styled.button`
  position: absolute;
  top: 0;
  ${props => props.$side === 'left' ? 'left: 0' : 'right: 0'};
  width: 50%;
  height: 100%;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 5;
`;

const OnlineBadge = styled.div`
  position: absolute;
  top: 70px;
  right: 20px;
  padding: 8px 16px;
  background: rgba(16, 185, 129, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 10;

  &:before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
  }
`;

const Content = styled.div`
  padding: 20px;
  padding-bottom: 120px;
`;

const ProfileHeader = styled.div`
  margin-bottom: 25px;
`;

const Name = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 0 0 10px 0;
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
`;

const Section = styled.div`
  margin-bottom: 25px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #e94586;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Bio = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
`;

const InterestsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const InterestTag = styled.div`
  padding: 10px 18px;
  background: rgba(233, 69, 134, 0.2);
  border: 2px solid rgba(233, 69, 134, 0.4);
  border-radius: 25px;
  color: white;
  font-size: 14px;
  font-weight: 600;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  margin-bottom: 10px;
`;

const InfoIcon = styled.div`
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(233, 69, 134, 0.2);
  border-radius: 12px;
`;

const InfoText = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  margin-bottom: 2px;
`;

const InfoValue = styled.div`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;

const ActionButtons = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 430px;
  width: 100%;
  background: rgba(26, 13, 46, 0.95);
  backdrop-filter: blur(10px);
  padding: 20px;
  display: flex;
  justify-content: center;
  gap: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ActionButton = styled(motion.button)`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LikeButton = styled(ActionButton)`
  background: #10b981;
  color: white;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
`;

const SuperLikeButton = styled(ActionButton)`
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  color: white;
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);
`;

const PassButton = styled(ActionButton)`
  background: #ef4444;
  color: white;
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: white;
  font-size: 18px;
`;

const interestLabels = {
  photography: 'Fotografia',
  cooking: 'Culinária',
  videogames: 'Videogames',
  music: 'Música',
  travelling: 'Viajar',
  shopping: 'Compras',
  speeches: 'Palestras',
  artscrafts: 'Arte e Artesanato',
  swimming: 'Natação',
  drinking: 'Drinks',
  extremesports: 'Esportes Radicais',
  fitness: 'Fitness'
};

const UserProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [matchedUser, setMatchedUser] = useState(null);
  const [commonInterests, setCommonInterests] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/users/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      alert('Erro ao carregar perfil do usuário');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    if (actionLoading) return;

    try {
      setActionLoading(true);
      const response = await axios.post('/matches/swipe', {
        targetUserId: userId,
        action // 'like', 'superlike', or 'pass'
      });

      if (response.data.match) {
        setMatchedUser(response.data.matchedUser);
        setCommonInterests(response.data.commonInterests || []);
      } else {
        // Voltar para a página anterior após a ação
        navigate(-1);
      }
    } catch (error) {
      console.error('Erro ao processar ação:', error);
      alert('Erro ao processar ação. Tente novamente.');
    } finally {
      setActionLoading(false);
    }
  };

  const nextPhoto = () => {
    if (user?.photos && currentPhotoIndex < user.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  if (loading) {
    return (
      <Container>
        <Loading>Carregando perfil...</Loading>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <Loading>Perfil não encontrado</Loading>
      </Container>
    );
  }

  const photos = user.photos && user.photos.length > 0 ? user.photos : [null];

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <IoArrowBack />
        </BackButton>
      </Header>

      <PhotosContainer>
        <PhotoIndicators>
          {photos.map((_, index) => (
            <Indicator key={index} $active={index === currentPhotoIndex} />
          ))}
        </PhotoIndicators>

        {user.isOnline && <OnlineBadge>Online</OnlineBadge>}

        <PhotoSlider $currentIndex={currentPhotoIndex}>
          {photos.map((photo, index) => (
            <Photo key={index} $photo={photo}>
              {!photo && (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '120px'
                }}>
                  👤
                </div>
              )}
            </Photo>
          ))}
        </PhotoSlider>

        {photos.length > 1 && (
          <>
            <PhotoNav $side="left" onClick={prevPhoto} />
            <PhotoNav $side="right" onClick={nextPhoto} />
          </>
        )}
      </PhotosContainer>

      <Content>
        <ProfileHeader>
          <Name>{user.firstName} {user.lastName}, {user.age}</Name>
          <Details>
            <span>📍 {user.distance || '0.5'} km de distância</span>
            {photos.length > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <IoCamera /> {photos.length} {photos.length === 1 ? 'foto' : 'fotos'}
              </span>
            )}
          </Details>
        </ProfileHeader>

        {user.bio && (
          <Section>
            <SectionTitle>📝 Sobre</SectionTitle>
            <Bio>{user.bio}</Bio>
          </Section>
        )}

        {user.interests && user.interests.length > 0 && (
          <Section>
            <SectionTitle>❤️ Interesses ({user.interests.length})</SectionTitle>
            <InterestsList>
              {user.interests.map((interest, index) => (
                <InterestTag key={index}>
                  {interestLabels[interest] || interest}
                </InterestTag>
              ))}
            </InterestsList>
          </Section>
        )}

        <Section>
          <SectionTitle>ℹ️ Informações</SectionTitle>
          
          {user.gender && (
            <InfoItem>
              <InfoIcon>👤</InfoIcon>
              <InfoText>
                <InfoLabel>Gênero</InfoLabel>
                <InfoValue>
                  {user.gender === 'male' ? 'Masculino' : 
                   user.gender === 'female' ? 'Feminino' : 'Outro'}
                </InfoValue>
              </InfoText>
            </InfoItem>
          )}

          <InfoItem>
            <InfoIcon>📍</InfoIcon>
            <InfoText>
              <InfoLabel>Localização</InfoLabel>
              <InfoValue>A {user.distance || '0.5'} km de você</InfoValue>
            </InfoText>
          </InfoItem>
        </Section>
      </Content>

      <ActionButtons>
        <PassButton
          onClick={() => handleAction('pass')}
          whileTap={{ scale: 0.9 }}
          disabled={actionLoading}
        >
          <IoClose />
        </PassButton>
        <LikeButton
          onClick={() => handleAction('like')}
          whileTap={{ scale: 0.9 }}
          disabled={actionLoading}
        >
          <IoThumbsUp />
        </LikeButton>
        <SuperLikeButton
          onClick={() => handleAction('superlike')}
          whileTap={{ scale: 0.9 }}
          disabled={actionLoading}
        >
          <IoHeart />
        </SuperLikeButton>
      </ActionButtons>

      {matchedUser && (
        <MatchPopup
          user={matchedUser}
          commonInterests={commonInterests}
          onClose={() => {
            setMatchedUser(null);
            setCommonInterests([]);
            navigate('/home');
          }}
          onMessage={() => {
            setMatchedUser(null);
            setCommonInterests([]);
            navigate('/matches');
          }}
        />
      )}
    </Container>
  );
};

export default UserProfile;

