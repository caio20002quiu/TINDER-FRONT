import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { IoArrowBack, IoEllipsisVertical, IoLogOut, IoSettings, IoPerson, IoHelpCircle } from 'react-icons/io5';
import axios from 'axios';
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

const Title = styled.h1`
  font-size: 42px;
  font-weight: 800;
  color: white;
  margin: 0;
  flex: 1;
  text-align: left;
  margin-left: 10px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  margin: 10px 0 30px 0;
`;

const Tabs = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
`;

const Tab = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.$active ? '#e94586' : 'rgba(255, 255, 255, 0.5)'};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  padding: 10px 0;
  border-bottom: 2px solid ${props => props.$active ? '#e94586' : 'transparent'};
  margin-bottom: -2px;
  font-family: 'Urbanist', sans-serif;

  &:hover {
    color: #e94586;
  }
`;

const MatchesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const MatchItem = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const MatchAvatar = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin-right: 15px;
  flex-shrink: 0;
  position: relative;
`;

const OnlineBadge = styled.div`
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #10b981;
  border: 3px solid #1a0d2e;
`;

const MatchInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const MatchName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin: 0 0 5px 0;
`;

const MatchMessage = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 5px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MatchTime = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
`;

const MenuButton = styled.div`
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  font-size: 24px;
  cursor: pointer;
  padding: 10px;
  position: relative;

  &:hover {
    color: white;
  }
`;

const DropdownMenu = styled(motion.div)`
  position: fixed;
  top: 70px;
  right: 20px;
  background: rgba(26, 13, 46, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  min-width: 220px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  z-index: 1000;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 15px 20px;
  background: transparent;
  border: none;
  color: white;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background: rgba(233, 69, 134, 0.2);
  }

  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  svg {
    font-size: 20px;
  }

  &.logout {
    color: #ef4444;
    
    &:hover {
      background: rgba(239, 68, 68, 0.1);
    }
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: linear-gradient(180deg, #2e1065 0%, #1a0d2e 100%);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  padding: 30px;
  max-width: 380px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
`;

const ModalTitle = styled.h2`
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 15px 0;
  text-align: center;
`;

const ModalText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  margin: 0 0 30px 0;
  text-align: center;
  line-height: 1.5;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 15px;
`;

const ModalButton = styled.button`
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 15px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &.cancel {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    
    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }

  &.confirm {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.3;
`;

const EmptyText = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
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

const Matches = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeTab, setActiveTab] = useState('todos');
  const menuRef = useRef(null);

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    loadMatches();
  }, [activeTab]);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Verificar se não clicou em um MenuItem
      const isMenuItem = event.target.closest('button')?.classList.contains('logout');
      
      if (menuRef.current && !menuRef.current.contains(event.target) && !isMenuItem) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      // Usar setTimeout para permitir que clicks sejam processados primeiro
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/matches?filter=${activeTab}`);
      setMatches(response.data);
    } catch (error) {
      console.error('Erro ao carregar matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    const matchDate = new Date(date);
    const now = new Date();
    const diff = now - matchDate;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return `${hours}h ago`;
    }
    
    return matchDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleLogoutClick = () => {
    console.log('Logout clicked!');
    // Fechar menu e abrir modal imediatamente
    setShowMenu(false);
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    console.log('Logout confirmed');
    logout();
    navigate('/login');
  };

  const handleLogoutCancel = () => {
    console.log('Logout cancelled');
    setShowLogoutModal(false);
  };

  if (loading) {
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
      <Header>
        <BackButton onClick={() => navigate('/home')}>
          <IoArrowBack />
        </BackButton>
        <Title>Seus Matches</Title>
        <MenuButton ref={menuRef} onClick={() => setShowMenu(!showMenu)}>
          <IoEllipsisVertical />
          {showMenu && (
            <DropdownMenu
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <MenuItem onClick={() => {
                setShowMenu(false);
                navigate('/profile');
              }}>
                <IoPerson />
                Meu Perfil
              </MenuItem>
              <MenuItem onClick={() => {
                setShowMenu(false);
                alert('Em breve: Configurações');
              }}>
                <IoSettings />
                Configurações
              </MenuItem>
              <MenuItem onClick={() => {
                setShowMenu(false);
                alert('Em breve: Ajuda & Suporte');
              }}>
                <IoHelpCircle />
                Ajuda & Suporte
              </MenuItem>
              <MenuItem 
                className="logout" 
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLogoutClick();
                }}
              >
                <IoLogOut />
                Sair da Conta
              </MenuItem>
            </DropdownMenu>
          )}
        </MenuButton>
      </Header>

      <Subtitle>Veja sua lista de matches e continue se divertindo</Subtitle>

      <Tabs>
        <Tab $active={activeTab === 'todos'} onClick={() => setActiveTab('todos')}>Todos</Tab>
        <Tab $active={activeTab === 'curtiu'} onClick={() => setActiveTab('curtiu')}>Você Curtiu</Tab>
        <Tab $active={activeTab === 'curtiram'} onClick={() => setActiveTab('curtiram')}>Curtiram Você</Tab>
        <Tab $active={activeTab === 'visualizacoes'} onClick={() => setActiveTab('visualizacoes')}>Visualizações</Tab>
      </Tabs>

      <MatchesList>
        {matches.length > 0 ? (
          matches.map((match, index) => (
            <MatchItem
              key={match._id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MatchAvatar>
                {match.isOnline && <OnlineBadge />}
              </MatchAvatar>
              <MatchInfo>
                <MatchName>{match.firstName} {match.lastName}</MatchName>
                <MatchMessage>
                  {match.lastMessage?.content || 'Diga olá para começar a conversar!'}
                </MatchMessage>
                <MatchTime>
                  {formatTime(match.lastMessage?.timestamp || match.matchedAt)}
                </MatchTime>
              </MatchInfo>
              <MenuButton>
                <IoEllipsisVertical />
              </MenuButton>
            </MatchItem>
          ))
        ) : (
          <EmptyState>
            <EmptyIcon>
              {activeTab === 'todos' && '💔'}
              {activeTab === 'curtiu' && '😔'}
              {activeTab === 'curtiram' && '💝'}
              {activeTab === 'visualizacoes' && '👀'}
            </EmptyIcon>
            <EmptyText>
              {activeTab === 'todos' && 'Você ainda não tem matches.'}
              {activeTab === 'curtiu' && 'Você ainda não curtiu ninguém.'}
              {activeTab === 'curtiram' && 'Ninguém te curtiu ainda.'}
              {activeTab === 'visualizacoes' && 'Nenhuma visualização ainda.'}
            </EmptyText>
            <EmptyText>
              {activeTab === 'todos' && 'Continue dando likes para encontrar seu par!'}
              {activeTab === 'curtiu' && 'Comece a dar likes em perfis que você goste!'}
              {activeTab === 'curtiram' && 'Continue usando o app para receber mais curtidas!'}
              {activeTab === 'visualizacoes' && 'Mantenha seu perfil ativo e atraente!'}
            </EmptyText>
          </EmptyState>
        )}
      </MatchesList>

      <BottomNav>
        <NavButton onClick={() => navigate('/home')}>
          <div style={{ fontSize: '28px', transform: 'rotate(15deg)' }}>🃏</div>
          <NavDot />
        </NavButton>
        <NavButton onClick={() => alert('⚙️ Configurações em breve!')}>
          <div style={{ fontSize: '28px' }}>⚙️</div>
          <NavDot />
        </NavButton>
        <NavButton $active onClick={() => navigate('/matches')}>
          <div style={{ fontSize: '28px' }}>💬</div>
          <NavDot $active />
        </NavButton>
        <NavButton onClick={() => navigate('/profile')}>
          <div style={{ fontSize: '28px' }}>👤</div>
          <NavDot />
        </NavButton>
      </BottomNav>

      <AnimatePresence>
        {showLogoutModal && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleLogoutCancel}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalTitle>Sair da Conta?</ModalTitle>
              <ModalText>
                Tem certeza que deseja sair? Você precisará fazer login novamente para continuar usando o app.
              </ModalText>
              <ModalButtons>
                <ModalButton className="cancel" onClick={handleLogoutCancel}>
                  Cancelar
                </ModalButton>
                <ModalButton className="confirm" onClick={handleLogoutConfirm}>
                  Sair
                </ModalButton>
              </ModalButtons>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default Matches;

