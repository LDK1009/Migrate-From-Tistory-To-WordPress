import { useAuthStore } from "@/store";
import { styled, Typography, Stack } from "@mui/material";

const AccountInformation = () => {
  const { user } = useAuthStore();

  // 계정 정보 데이터
  const accountInfo = [
    { title: "이메일", value: user.email },
    { title: "가입일", value: new Date(user?.created_at).toLocaleDateString() },
  ];

  //////////////////////////////////////// Render ////////////////////////////////////////

  return (
    <Container>
      {/* 섹션 제목 */}
      <Title variant="h6">계정 정보</Title>

      {/* 정보 카드 */}
      <InfoCard>
        {accountInfo.map((item, index) => (
          <InfoItem key={index}>
            {/* 정보 항목 제목 */}
            <InfoTitle variant="body1">{item.title}</InfoTitle>

            {/* 정보 항목 값 */}
            <InfoValue variant="body2">{item.value}</InfoValue>
          </InfoItem>
        ))}
      </InfoCard>
    </Container>
  );
};

export default AccountInformation;

//////////////////////////////////////// Styles ////////////////////////////////////////

// 계정 정보 컨테이너 스타일
const Container = styled(Stack)`
  width: 100%;
  row-gap: 4px;
`;

const Title = styled(Typography)`
  font-weight: bold;
  color: ${({ theme }) => theme.palette.primary.main};
`;

// 정보 카드 스타일
const InfoCard = styled(Stack)`
  width: 100%;
  padding: 16px;
  row-gap: 8px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.palette.primary.main};
`;

// 정보 항목 스타일
const InfoItem = styled(Stack)`
  width: 100%;
`;

// 정보 항목 제목 스타일
const InfoTitle = styled(Typography)`
  color: ${({ theme }) => theme.palette.text.secondary};
`;

// 정보 항목 값 스타일
const InfoValue = styled(Typography)`
  color: ${({ theme }) => theme.palette.text.primary};
`;
