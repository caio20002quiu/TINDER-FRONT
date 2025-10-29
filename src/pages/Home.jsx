import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { IoSearch, IoNotifications, IoEllipsisVertical, IoThumbsUp, IoHeart, IoClose, IoChatbubble, IoLogOut, IoSettings, IoPerson, IoHelpCircle, IoInformationCircle } from 'react-icons/io5';
import axios from 'axios';
import MatchPopup from '../components/MatchPopup';
import { useAuth } from '../context/AuthContext';

const Container = styled.div`
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(180deg, #1a0d2e 0%, #2e1065 100%);
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const StoryButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    opacity: 0.8;
  }
`;

const AddStoryIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e94586 0%, #a855f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
`;

const IconGroup = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const IconButton = styled.div`
  background: transparent;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover {
    opacity: 0.7;
  }
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 45px;
  right: 0;
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

const CardsContainer = styled.div`
  position: relative;
  width: 100%;
  height: 550px;
  margin-bottom: 30px;
  z-index: 10;
`;

const Card = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  overflow: hidden;
  cursor: grab;
  user-select: none;
  
  &:active {
    cursor: grabbing;
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.$hasPhoto 
    ? `url(${props.$photo}) center/cover no-repeat` 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.4) 40%, transparent 100%);
    pointer-events: none;
    z-index: 1;
  }
`;

const OnlineBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  background: rgba(16, 185, 129, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  color: white;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  z-index: 20;

  &:before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const CardInfo = styled.div`
  position: absolute;
  bottom: 80px;
  left: 0;
  right: 0;
  padding: 25px;
  z-index: 10;
  pointer-events: none;
  
  * {
    pointer-events: auto;
  }
`;

const CardName = styled.h2`
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 8px 0;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.5px;
`;

const CardDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const DetailItem = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  font-weight: 500;
  font-size: 13px;
`;

const CardBio = styled.p`
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  line-height: 1.5;
  margin: 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const InterestBadges = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
`;

const InterestBadge = styled.span`
  padding: 6px 14px;
  background: rgba(233, 69, 134, 0.25);
  border: 1.5px solid rgba(233, 69, 134, 0.5);
  border-radius: 20px;
  color: white;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(233, 69, 134, 0.2);
`;

const CardActionButtons = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 20;
  gap: 12px;
`;

const InfoButton = styled.button`
  flex: 1;
  height: 48px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.25);
  color: white;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  font-family: 'Urbanist', sans-serif;
  letter-spacing: 0.3px;

  svg {
    font-size: 20px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  }

  &:active {
    transform: translateY(0);
  }
`;

const MessageButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e94586 0%, #d946a6 100%);
  backdrop-filter: blur(10px);
  border: none;
  color: white;
  font-size: 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(233, 69, 134, 0.5);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    padding: 2px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), transparent);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  &:hover {
    background: linear-gradient(135deg, #d946a6 0%, #e94586 100%);
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 24px rgba(233, 69, 134, 0.7);
  }

  &:active {
    transform: translateY(0) scale(1);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 60px;
  position: relative;
  z-index: 50;
`;

const ActionButton = styled(motion.button)`
  width: 65px;
  height: 65px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const LikeButton = styled(ActionButton)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.5), 0 0 0 0 rgba(16, 185, 129, 0);
  
  &:hover {
    box-shadow: 0 12px 32px rgba(16, 185, 129, 0.6);
    transform: scale(1.15);
  }
`;

const SuperLikeButton = styled(ActionButton)`
  width: 75px;
  height: 75px;
  background: linear-gradient(135deg, #e94586 0%, #d946a6 100%);
  color: white;
  box-shadow: 0 8px 24px rgba(233, 69, 134, 0.5);
  font-size: 32px;
  
  &:hover {
    box-shadow: 0 12px 32px rgba(233, 69, 134, 0.6);
    transform: scale(1.15);
  }

  &::before {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    padding: 3px;
    background: linear-gradient(135deg, #e94586, #f97316, #f59e0b);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.5;
  }
`;

const PassButton = styled(ActionButton)`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.5);
  
  &:hover {
    box-shadow: 0 12px 32px rgba(239, 68, 68, 0.6);
    transform: scale(1.15);
  }
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
  z-index: 100;
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

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 550px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  padding: 40px;
`;

const SwipeIndicator = styled(motion.div)`
  position: absolute;
  top: 50%;
  ${props => props.$direction === 'right' ? 'right: 50px' : 'left: 50px'};
  transform: translateY(-50%);
  font-size: 80px;
  z-index: 10;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
`;

const Toast = styled(motion.div)`
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.$type === 'like' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)'};
  color: white;
  padding: 15px 30px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
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

const interestLabels = {
  photography: 'Fotografia',
  cooking: 'Culinária',
  videogames: 'Games',
  music: 'Música',
  travelling: 'Viajar',
  shopping: 'Compras',
  speeches: 'Palestras',
  artscrafts: 'Arte',
  swimming: 'Natação',
  drinking: 'Drinks',
  extremesports: 'Esportes Radicais',
  fitness: 'Fitness'
};

const Home = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchedUser, setMatchedUser] = useState(null);
  const [commonInterests, setCommonInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('like');
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeTab, setActiveTab] = useState('todos');
  const cardRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    loadUsers();
    setCurrentIndex(0); // Resetar para o primeiro card quando mudar de aba
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

  // Debug modal state
  useEffect(() => {
    console.log('showLogoutModal changed:', showLogoutModal);
  }, [showLogoutModal]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/users/discover?filter=${activeTab}`);
      setUsers(response.data);
      
      // Mostrar feedback visual quando filtro está ativo
      if (response.data.length === 0) {
        let message = '';
        switch (activeTab) {
          case 'online':
            message = '😔 Nenhum usuário online no momento';
            break;
          case 'novos':
            message = '😔 Nenhum perfil novo disponível';
            break;
          case 'curtiram':
            message = '😔 Ninguém te curtiu ainda';
            break;
          default:
            message = '😔 Nenhum usuário disponível';
        }
        setToastMessage(message);
        setToastType('pass');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setToastMessage('❌ Erro ao carregar perfis');
      setToastType('pass');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction, userId, isSuperLike = false) => {
    const action = isSuperLike ? 'superlike' : (direction === 'right' ? 'like' : 'pass');
    
    // Definir direção da animação
    setSwipeDirection(direction);
    
    // Aguardar animação completar
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const response = await axios.post('/api/matches/swipe', {
        targetUserId: userId,
        action
      });

      if (response.data.match) {
        setMatchedUser(response.data.matchedUser);
        setCommonInterests(response.data.commonInterests || []);
      } else if (response.data.mutualLike && !response.data.match) {
        // Ambos se curtiram mas não têm interesses em comum
        setToastMessage(`💔 ${response.data.message}`);
        setToastType('like');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        // Mostrar feedback da ação
        const userName = currentUser?.firstName || 'Perfil';
        if (isSuperLike) {
          setToastMessage(`⭐ Super Like em ${userName}!`);
          setToastType('like');
        } else {
          setToastMessage(action === 'like' ? `💚 Você curtiu ${userName}!` : `😊 Passou em ${userName}`);
          setToastType(action);
        }
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }
    } catch (error) {
      console.error('Erro ao fazer swipe:', error);
      setToastMessage('❌ Erro ao processar ação. Tente novamente.');
      setToastType('pass');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }

    // Próximo card
    setCurrentIndex(currentIndex + 1);
    setSwipeDirection(null);
  };

  const handleSuperLike = async (userId) => {
    await handleSwipe('right', userId, true);
  };

  const currentUser = users[currentIndex];
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event, info) => {
    if (Math.abs(info.offset.x) > 100) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      handleSwipe(direction, currentUser.id || currentUser._id);
    }
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
        <StoryButton onClick={() => {
          setToastMessage('📸 Stories em breve!');
          setToastType('like');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2000);
        }}>
          <AddStoryIcon>+</AddStoryIcon>
          Adicionar Story
        </StoryButton>
        <IconGroup>
          <IconButton onClick={() => {
            setToastMessage('🔍 Busca em breve!');
            setToastType('like');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
          }}>
            <IoSearch />
          </IconButton>
          <IconButton onClick={() => {
            setToastMessage('🔔 Notificações em breve!');
            setToastType('like');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
          }}>
            <IoNotifications />
          </IconButton>
          <IconButton ref={menuRef} onClick={() => setShowMenu(!showMenu)}>
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
          </IconButton>
        </IconGroup>
      </Header>

      <Tabs>
        <Tab $active={activeTab === 'todos'} onClick={() => setActiveTab('todos')}>Todos</Tab>
        <Tab $active={activeTab === 'online'} onClick={() => setActiveTab('online')}>Online</Tab>
        <Tab $active={activeTab === 'novos'} onClick={() => setActiveTab('novos')}>Novos</Tab>
        <Tab $active={activeTab === 'curtiram'} onClick={() => setActiveTab('curtiram')}>Curtiram Você</Tab>
      </Tabs>

      <CardsContainer>
        {currentUser ? (
          <>
            <Card
              ref={cardRef}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              style={{ x, rotate, opacity }}
              onDragEnd={handleDragEnd}
              animate={swipeDirection ? {
                x: swipeDirection === 'right' ? 400 : -400,
                rotate: swipeDirection === 'right' ? 25 : -25,
                opacity: 0
              } : {}}
            >
              <CardImage 
                $hasPhoto={currentUser.photos && currentUser.photos.length > 0}
                $photo={currentUser.photos && currentUser.photos.length > 0 ? currentUser.photos[0] : null}
              >
                {currentUser.isOnline && <OnlineBadge>Online</OnlineBadge>}
                <CardInfo>
                  <CardName>
                    {currentUser.firstName} {currentUser.lastName}, {currentUser.age}
                  </CardName>
                  <CardDetails>
                    <DetailItem>📍 {currentUser.distance} km</DetailItem>
                    {currentUser.photos && currentUser.photos.length > 0 && (
                      <DetailItem>📷 {currentUser.photos.length}</DetailItem>
                    )}
                    {currentUser.gender && (
                      <DetailItem>
                        {currentUser.gender === 'male' ? '👨' : currentUser.gender === 'female' ? '👩' : '🧑'}
                      </DetailItem>
                    )}
                  </CardDetails>
                  
                  {currentUser.bio && (
                    <CardBio>{currentUser.bio}</CardBio>
                  )}
                  
                  {currentUser.interests && currentUser.interests.length > 0 && (
                    <InterestBadges>
                      {currentUser.interests.slice(0, 3).map((interest, index) => (
                        <InterestBadge key={index}>
                          {interestLabels[interest] || interest}
                        </InterestBadge>
                      ))}
                      {currentUser.interests.length > 3 && (
                        <InterestBadge>+{currentUser.interests.length - 3}</InterestBadge>
                      )}
                    </InterestBadges>
                  )}
                </CardInfo>
                
                <CardActionButtons>
                  <InfoButton onClick={() => navigate(`/user/${currentUser.id || currentUser._id}`)}>
                    <IoInformationCircle />
                    Ver Perfil
                  </InfoButton>
                  <MessageButton onClick={() => {
                    setToastMessage('💬 Envie um like primeiro para começar a conversar!');
                    setToastType('like');
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 2000);
                  }}>
                    <IoChatbubble />
                  </MessageButton>
                </CardActionButtons>
              </CardImage>
            </Card>
            
            {swipeDirection && (
              <SwipeIndicator
                $direction={swipeDirection}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                {swipeDirection === 'right' ? '💚' : '❌'}
              </SwipeIndicator>
            )}
          </>
        ) : (
          <EmptyState>
            <h2>Não há mais pessoas por perto</h2>
            <p>Volte mais tarde para ver novos perfis!</p>
          </EmptyState>
        )}
      </CardsContainer>

      {currentUser && (
        <ActionButtons>
          <LikeButton
            onClick={() => handleSwipe('right', currentUser.id || currentUser._id)}
            whileTap={{ scale: 0.9 }}
          >
            <IoThumbsUp />
          </LikeButton>
          <SuperLikeButton 
            onClick={() => handleSuperLike(currentUser.id || currentUser._id)}
            whileTap={{ scale: 0.9 }}
          >
            <IoHeart />
          </SuperLikeButton>
          <PassButton
            onClick={() => handleSwipe('left', currentUser.id || currentUser._id)}
            whileTap={{ scale: 0.9 }}
          >
            <IoClose />
          </PassButton>
        </ActionButtons>
      )}

      <BottomNav>
        <NavButton $active onClick={() => navigate('/home')}>
          <div style={{ fontSize: '28px', transform: 'rotate(15deg)' }}>🃏</div>
          <NavDot $active />
        </NavButton>
        <NavButton onClick={() => {
          setToastMessage('⚙️ Configurações em breve!');
          setToastType('like');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2000);
        }}>
          <div style={{ fontSize: '28px' }}>⚙️</div>
          <NavDot />
        </NavButton>
        <NavButton onClick={() => navigate('/matches')}>
          <div style={{ fontSize: '28px' }}>💬</div>
          <NavDot />
        </NavButton>
        <NavButton onClick={() => navigate('/profile')}>
          <div style={{ fontSize: '28px' }}>👤</div>
          <NavDot />
        </NavButton>
      </BottomNav>

      {showToast && (
        <Toast
          $type={toastType}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          {toastMessage}
        </Toast>
      )}

      {matchedUser && (
        <MatchPopup
          user={matchedUser}
          commonInterests={commonInterests}
          onClose={() => {
            setMatchedUser(null);
            setCommonInterests([]);
          }}
          onMessage={() => {
            setMatchedUser(null);
            setCommonInterests([]);
            navigate('/matches');
          }}
        />
      )}

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

export default Home;

