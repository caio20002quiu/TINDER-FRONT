import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { IoArrowBack, IoCamera } from 'react-icons/io5';
import { Container, PageContainer, BackButton, Title, Subtitle, Input, Button, Select } from '../styles/GlobalStyles';

const PhotoUpload = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 3px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 40px auto;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #e94586;
    background: rgba(255, 255, 255, 0.08);
  }
`;

const UserIcon = styled.div`
  font-size: 60px;
  color: rgba(255, 255, 255, 0.3);
`;

const CameraButton = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e94586 0%, #a855f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(233, 69, 134, 0.4);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Label = styled.label`
  font-size: 14px;
  color: #e94586;
  margin-bottom: 10px;
  font-weight: 600;
`;

const PhotoPreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 15px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
  font-family: 'Urbanist', sans-serif;
  resize: vertical;
  min-height: 100px;
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #e94586;
    background: rgba(255, 255, 255, 0.08);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

const CharCounter = styled.div`
  text-align: right;
  color: ${props => props.$overLimit ? '#ef4444' : 'rgba(255, 255, 255, 0.5)'};
  font-size: 14px;
  margin-top: -15px;
  margin-bottom: 20px;
`;

const ProfileDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    preference: 'both',
    bio: '',
    photoUrl: ''
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Limitar biografia a 500 caracteres
    if (name === 'bio' && value.length > 500) {
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePhotoClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Verificar tamanho do arquivo (máx 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('A imagem deve ter no máximo 5MB');
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setPhotoPreview(base64String);
          setFormData({
            ...formData,
            photoUrl: base64String
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Salvar dados do perfil
    const signupData = JSON.parse(localStorage.getItem('signupData') || '{}');
    localStorage.setItem('signupData', JSON.stringify({
      ...signupData,
      ...formData
    }));
    
    navigate('/interests');
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <PageContainer>
          <BackButton onClick={() => navigate('/signup')}>
            <IoArrowBack />
          </BackButton>

          <Title>Detalhes do Perfil</Title>
          <Subtitle>Preencha os dados a seguir</Subtitle>

          <Form onSubmit={handleSubmit}>
            <PhotoUpload onClick={handlePhotoClick}>
              {photoPreview ? (
                <PhotoPreview src={photoPreview} alt="Preview" />
              ) : (
                <UserIcon>👤</UserIcon>
              )}
              <CameraButton>
                <IoCamera />
              </CameraButton>
            </PhotoUpload>

            <Label>Nome</Label>
            <Input
              type="text"
              name="firstName"
              placeholder="João"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <Label>Sobrenome</Label>
            <Input
              type="text"
              name="lastName"
              placeholder="Silva"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

            <Label>Data de Nascimento</Label>
            <Input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />

            <Label>Selecione seu gênero</Label>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o gênero</option>
              <option value="male">Masculino</option>
              <option value="female">Feminino</option>
              <option value="other">Outro</option>
            </Select>

            <Label>Interessado em</Label>
            <Select
              name="preference"
              value={formData.preference}
              onChange={handleChange}
            >
              <option value="both">Ambos</option>
              <option value="male">Homens</option>
              <option value="female">Mulheres</option>
            </Select>

            <Label>Biografia (opcional)</Label>
            <TextArea
              name="bio"
              placeholder="Conte um pouco sobre você..."
              value={formData.bio}
              onChange={handleChange}
              maxLength="500"
            />
            <CharCounter $overLimit={formData.bio.length > 500}>
              {formData.bio.length}/500 caracteres
            </CharCounter>

            <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
              <Button type="submit">Continuar</Button>
            </div>
          </Form>
        </PageContainer>
      </motion.div>
    </Container>
  );
};

export default ProfileDetails;

