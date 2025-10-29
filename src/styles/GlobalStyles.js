import styled from 'styled-components';

export const Container = styled.div`
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(180deg, #1a0d2e 0%, #2e1065 100%);
  position: relative;
  overflow: hidden;
`;

export const PageContainer = styled.div`
  padding: 40px 24px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  &:hover {
    opacity: 0.7;
  }
`;

export const Title = styled.h1`
  font-size: 48px;
  font-weight: 800;
  color: white;
  margin-bottom: 10px;
  text-align: center;
`;

export const Subtitle = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
  text-align: center;
`;

export const Input = styled.input`
  width: 100%;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  color: white;
  font-size: 16px;
  font-family: 'Urbanist', sans-serif;
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    outline: none;
    border-color: #e94586;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 20px rgba(233, 69, 134, 0.3);
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 20px;
  background: linear-gradient(90deg, #e94586 0%, #a855f7 100%);
  border: none;
  border-radius: 50px;
  color: white;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Urbanist', sans-serif;
  box-shadow: 0 8px 24px rgba(233, 69, 134, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(233, 69, 134, 0.6);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Link = styled.a`
  color: #e94586;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #ff5fa2;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  color: white;
  font-size: 16px;
  font-family: 'Urbanist', sans-serif;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 24px center;
  padding-right: 50px;

  option {
    background: #2e1065;
    color: white;
  }

  &:focus {
    outline: none;
    border-color: #e94586;
    background-color: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 20px rgba(233, 69, 134, 0.3);
  }
`;


