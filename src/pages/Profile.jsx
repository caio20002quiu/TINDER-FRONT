import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { IoArrowBack, IoSettings, IoCamera, IoPencil } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';

const Container = styled.div`
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(180deg, #1a0d2e 0%, #2e1065 100%);
  padding: 20px;
  padding-bottom: 100px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 10px;
  display: flex;
  align-items: center;

  &:hover {
    opacity: 0.7;
  }
`;

const SettingsButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 10px;

  &:hover {
    opacity: 0.7;
  }
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const PhotoContainer = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  margin: 0 auto 20px;
  position: relative;
  border: 4px solid rgba(233, 69, 134, 0.3);
  overflow: hidden;
`;

const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PhotoPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
`;

const EditPhotoButton = styled.button`
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e94586 0%, #a855f7 100%);
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(233, 69, 134, 0.4);

  &:hover {
    transform: scale(1.05);
  }
`;

const Name = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 0 0 5px 0;
`;

const Age = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
`;

const InfoSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #e94586;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const EditButton = styled.button`
  background: transparent;
  border: none;
  color: #e94586;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;

  &:hover {
    opacity: 0.7;
  }
`;

const InfoItem = styled.div`
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 5px;
`;

const InfoValue = styled.div`
  font-size: 16px;
  color: white;
  font-weight: 500;
`;

const Bio = styled.p`
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
`;

const InterestsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const InterestTag = styled.span`
  background: rgba(233, 69, 134, 0.2);
  color: #e94586;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid rgba(233, 69, 134, 0.3);
`;

const BottomNav = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 430px;
  width: 100%;
  background: rgba(26, 13, 46, 0.95);
  backdrop-filter: blur(10px);
  padding: 1px 30px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const NavButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.$active ? '#e94586' : 'rgba(255, 255, 255, 0.5)'};
  font-size: 28px;
  cursor: pointer;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  &:hover {
    color: #e94586;
  }
`;

const NavDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${props => props.$active ? '#e94586' : 'transparent'};
`;

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData(user);
    }
  }, [user]);

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getGenderLabel = (gender) => {
    const labels = {
      'male': 'Masculino',
      'female': 'Feminino',
      'other': 'Outro'
    };
    return labels[gender] || gender;
  };

  const getPreferenceLabel = (preference) => {
    const labels = {
      'male': 'Homens',
      'female': 'Mulheres',
      'both': 'Ambos'
    };
    return labels[preference] || preference;
  };

  if (!profileData) {
    return (
      <Container>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          Carregando...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <BackButton onClick={() => navigate('/home')}>
            <IoArrowBack />
          </BackButton>
          <SettingsButton onClick={() => alert('⚙️ Configurações em breve!')}>
            <IoSettings />
          </SettingsButton>
        </Header>

        <ProfileHeader>
          <PhotoContainer>
            {profileData.photos && profileData.photos.length > 0 ? (
              <Photo src={profileData.photos[0]} alt="Foto de perfil" />
            ) : (
              <PhotoPlaceholder>👤</PhotoPlaceholder>
            )}
            <EditPhotoButton onClick={() => alert('📸 Upload de foto em breve!')}>
              <IoCamera />
            </EditPhotoButton>
          </PhotoContainer>
          <Name>{profileData.firstName} {profileData.lastName}</Name>
          <Age>{profileData.age || calculateAge(profileData.dateOfBirth)} anos</Age>
        </ProfileHeader>

        {profileData.bio && (
          <InfoSection>
            <SectionTitle>
              Sobre mim
              <EditButton onClick={() => alert('✏️ Edição em breve!')}>
                <IoPencil />
              </EditButton>
            </SectionTitle>
            <Bio>{profileData.bio}</Bio>
          </InfoSection>
        )}

        <InfoSection>
          <SectionTitle>
            Informações Básicas
            <EditButton onClick={() => alert('✏️ Edição em breve!')}>
              <IoPencil />
            </EditButton>
          </SectionTitle>
          
          <InfoItem>
            <InfoLabel>Gênero</InfoLabel>
            <InfoValue>{getGenderLabel(profileData.gender)}</InfoValue>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel>Interessado em</InfoLabel>
            <InfoValue>{getPreferenceLabel(profileData.preference)}</InfoValue>
          </InfoItem>
          
          {profileData.email && (
            <InfoItem>
              <InfoLabel>Email</InfoLabel>
              <InfoValue>{profileData.email}</InfoValue>
            </InfoItem>
          )}
        </InfoSection>

        {profileData.interests && profileData.interests.length > 0 && (
          <InfoSection>
            <SectionTitle>
              Interesses ({profileData.interests.length})
              <EditButton onClick={() => alert('✏️ Edição em breve!')}>
                <IoPencil />
              </EditButton>
            </SectionTitle>
            <InterestsList>
              {profileData.interests.map((interest, index) => (
                <InterestTag key={index}>{interest}</InterestTag>
              ))}
            </InterestsList>
          </InfoSection>
        )}

        <BottomNav>
          <NavButton onClick={() => navigate('/home')}>
            <div style={{ fontSize: '28px', transform: 'rotate(15deg)' }}>🃏</div>
            <NavDot />
          </NavButton>
          <NavButton onClick={() => alert('⚙️ Configurações em breve!')}>
            <div style={{ fontSize: '28px' }}>⚙️</div>
            <NavDot />
          </NavButton>
          <NavButton onClick={() => navigate('/matches')}>
            <div style={{ fontSize: '28px' }}>💬</div>
            <NavDot />
          </NavButton>
          <NavButton $active>
            <div style={{ fontSize: '28px' }}>👤</div>
            <NavDot $active />
          </NavButton>
        </BottomNav>
      </motion.div>
    </Container>
  );
};

export default Profile;

